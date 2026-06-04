<?php


require_once 'config.php';

//  GET — ambil pesanan
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $userId = (int)($_GET['user_id'] ?? 0);
    $nomor  = trim($_GET['nomor']   ?? '');

    if ($nomor) {
        // --- Detail satu pesanan berdasarkan nomor ---
        $stmt = $conn->prepare(
            'SELECT p.*, pr.nama AS nama_produk, pr.gambar,
                    t.nama AS nama_toko,
                    py.metode, py.status AS status_bayar, py.waktu_bayar
             FROM pesanan p
             JOIN produk pr ON pr.id = p.produk_id
             JOIN toko   t  ON t.id  = pr.toko_id
             LEFT JOIN pembayaran py ON py.pesanan_id = p.id
             WHERE p.nomor_pesanan = ?'
        );
        $stmt->bind_param('s', $nomor);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Pesanan tidak ditemukan']);
        } else {
            $row = $result->fetch_assoc();
            echo json_encode(['success' => true, 'data' => $row]);
        }
        $stmt->close();

    } elseif ($userId) {
        // --- Semua pesanan milik user ---
        $stmt = $conn->prepare(
            'SELECT p.id, p.nomor_pesanan, p.produk_id, p.model, p.warna, p.ukuran,
                    p.tanggal_mulai, p.tanggal_selesai, p.durasi_hari,
                    p.total_harga, p.status, p.created_at,
                    pr.nama AS nama_produk, pr.gambar,
                    t.nama  AS nama_toko
             FROM pesanan p
             JOIN produk pr ON pr.id = p.produk_id
             JOIN toko   t  ON t.id  = pr.toko_id
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC'
        );
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        $list = [];
        while ($row = $result->fetch_assoc()) {
            $list[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $list]);
        $stmt->close();

    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Parameter user_id atau nomor diperlukan']);
    }

    $conn->close();
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = getJsonBody();

    $userId        = (int)($data['user_id']        ?? 0);
    $produkId      = (int)($data['produk_id']      ?? 0);
    $model         = trim($data['model']            ?? '');
    $warna         = trim($data['warna']            ?? '');
    $ukuran        = trim($data['ukuran']           ?? '');
    $tglMulai      = trim($data['tanggal_mulai']    ?? '');
    $tglSelesai    = trim($data['tanggal_selesai']  ?? '');
    $durasiHari    = (int)($data['durasi_hari']     ?? 0);
    $totalHarga    = (float)($data['total_harga']   ?? 0);
    $metodeBayar   = trim($data['metode_bayar']     ?? 'QRIS');

    // --- Validasi input ---
    if (!$userId || !$produkId || !$model || !$warna || !$ukuran
        || !$tglMulai || !$tglSelesai || !$durasiHari || !$totalHarga) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Semua field pesanan wajib diisi']);
        exit;
    }

    if ($durasiHari < 1 || $durasiHari > 3) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Durasi sewa maksimal 3 hari']);
        exit;
    }

    if ($tglSelesai < $tglMulai) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Tanggal selesai tidak boleh sebelum tanggal mulai']);
        exit;
    }

    // --- Generate nomor pesanan unik ---
    do {
        $nomorPesanan = 'RB' . str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $cek = $conn->prepare('SELECT id FROM pesanan WHERE nomor_pesanan = ?');
        $cek->bind_param('s', $nomorPesanan);
        $cek->execute();
        $cek->store_result();
        $exists = $cek->num_rows > 0;
        $cek->close();
    } while ($exists);

    // --- Mulai transaksi agar pesanan & pembayaran atomik ---
    $conn->begin_transaction();

    try {
        // Insert pesanan
        $stmtP = $conn->prepare(
            'INSERT INTO pesanan
               (nomor_pesanan, user_id, produk_id, model, warna, ukuran,
                tanggal_mulai, tanggal_selesai, durasi_hari, total_harga, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "menunggu_pembayaran")'
        );
        $stmtP->bind_param(
            'siisssssid',
            $nomorPesanan, $userId, $produkId,
            $model, $warna, $ukuran,
            $tglMulai, $tglSelesai, $durasiHari, $totalHarga
        );
        $stmtP->execute();
        $pesananId = $conn->insert_id;
        $stmtP->close();

        // Insert pembayaran (status awal: menunggu)
        $stmtByr = $conn->prepare(
            'INSERT INTO pembayaran (pesanan_id, metode, status) VALUES (?, ?, "menunggu")'
        );
        $stmtByr->bind_param('is', $pesananId, $metodeBayar);
        $stmtByr->execute();
        $stmtByr->close();

        $conn->commit();

        echo json_encode([
            'success'       => true,
            'message'       => 'Pesanan berhasil dibuat',
            'nomor_pesanan' => $nomorPesanan,
            'pesanan_id'    => $pesananId
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal membuat pesanan: ' . $e->getMessage()]);
    }

    $conn->close();
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
