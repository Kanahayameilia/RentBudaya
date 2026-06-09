<?php

require_once 'config.php';

// --- GET: Mengambil daftar produk berdasarkan toko_id ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $toko_id = (int)($_GET['toko_id'] ?? 0);
    
    if (!$toko_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'toko_id diperlukan']);
        exit;
    }
    
    $stmt = $conn->prepare('SELECT id, toko_id, nama, deskripsi, harga_per_hari, ukuran, gambar, created_at FROM produk WHERE toko_id = ? ORDER BY id DESC');
    $stmt->bind_param('i', $toko_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $produkList = [];
    while ($row = $result->fetch_assoc()) {
        $produkList[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    echo json_encode(['success' => true, 'data' => $produkList]);
    exit;
}

// --- POST: Menambah atau mengedit produk ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = (int)($_POST['id'] ?? 0);
    $toko_id = (int)($_POST['toko_id'] ?? 0);
    $nama = trim($_POST['nama'] ?? '');
    $deskripsi = trim($_POST['deskripsi'] ?? '');
    $harga = (float)($_POST['harga_per_hari'] ?? 0);
    $ukuran = trim($_POST['ukuran'] ?? 'M');
    
    if ($id > 0) {
        // --- LOGIKA EDIT/UPDATE PRODUK ---
        if (!$nama || $harga <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'nama dan harga_per_hari wajib diisi']);
            exit;
        }
        
        // Handle upload gambar jika ada gambar baru
        $gambar = '';
        if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === 0) {
            $uploadDir = __DIR__ . '/../Assets/image/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $ext = pathinfo($_FILES['gambar']['name'], PATHINFO_EXTENSION);
            $gambar = time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['gambar']['tmp_name'], $uploadDir . $gambar);
        }
        
        if ($gambar !== '') {
            $stmt = $conn->prepare(
                'UPDATE produk SET nama = ?, deskripsi = ?, harga_per_hari = ?, ukuran = ?, gambar = ? WHERE id = ?'
            );
            $stmt->bind_param('ssdssi', $nama, $deskripsi, $harga, $ukuran, $gambar, $id);
        } else {
            $stmt = $conn->prepare(
                'UPDATE produk SET nama = ?, deskripsi = ?, harga_per_hari = ?, ukuran = ? WHERE id = ?'
            );
            $stmt->bind_param('ssdsi', $nama, $deskripsi, $harga, $ukuran, $id);
        }
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Produk berhasil diperbarui']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui produk: ' . $stmt->error]);
        }
        
        $stmt->close();
        $conn->close();
        exit;
        
    } else {
        // --- LOGIKA TAMBAH/INSERT PRODUK ---
        if (!$toko_id || !$nama || $harga <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'toko_id, nama, dan harga_per_hari wajib diisi']);
            exit;
        }
        
        // Handle upload gambar
        $gambar = '';
        if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === 0) {
            $uploadDir = __DIR__ . '/../Assets/image/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $ext = pathinfo($_FILES['gambar']['name'], PATHINFO_EXTENSION);
            $gambar = time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['gambar']['tmp_name'], $uploadDir . $gambar);
        }
        
        $stmt = $conn->prepare(
            'INSERT INTO produk (toko_id, nama, deskripsi, harga_per_hari, ukuran, gambar) 
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->bind_param('issdss', $toko_id, $nama, $deskripsi, $harga, $ukuran, $gambar);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Produk berhasil ditambahkan', 'produk_id' => $conn->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menambah produk: ' . $stmt->error]);
        }
        
        $stmt->close();
        $conn->close();
        exit;
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
?>