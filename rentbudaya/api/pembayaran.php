<?php


require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$data         = getJsonBody();
$nomorPesanan = trim($data['nomor_pesanan'] ?? '');

if (!$nomorPesanan) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nomor pesanan wajib diisi']);
    exit;
}

// --- Ambil data pesanan ---
$stmt = $conn->prepare(
    'SELECT p.id, p.status, py.id AS bayar_id, py.status AS status_bayar
     FROM pesanan p
     JOIN pembayaran py ON py.pesanan_id = p.id
     WHERE p.nomor_pesanan = ?'
);
$stmt->bind_param('s', $nomorPesanan);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Pesanan tidak ditemukan']);
    $stmt->close();
    exit;
}

$row = $result->fetch_assoc();
$stmt->close();

if ($row['status_bayar'] === 'lunas') {
    echo json_encode(['success' => true, 'message' => 'Pembayaran sudah dikonfirmasi sebelumnya']);
    exit;
}

// --- Update pembayaran 
$waktuBayar = date('Y-m-d H:i:s');
$pesananId  = $row['id'];
$bayarId    = $row['bayar_id'];

$conn->begin_transaction();
try {
    $s1 = $conn->prepare('UPDATE pembayaran SET status = "lunas", waktu_bayar = ? WHERE id = ?');
    $s1->bind_param('si', $waktuBayar, $bayarId);
    $s1->execute();
    $s1->close();

    $s2 = $conn->prepare('UPDATE pesanan SET status = "pembayaran_dikonfirmasi" WHERE id = ?');
    $s2->bind_param('i', $pesananId);
    $s2->execute();
    $s2->close();

    $conn->commit();

    echo json_encode([
        'success'    => true,
        'message'    => 'Pembayaran berhasil dikonfirmasi',
        'waktu_bayar'=> $waktuBayar
    ]);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal konfirmasi pembayaran']);
}

$conn->close();
