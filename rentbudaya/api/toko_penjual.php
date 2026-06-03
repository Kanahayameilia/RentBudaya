<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $seller_id = (int)($_GET['seller_id'] ?? 0);
    
    if (!$seller_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'seller_id diperlukan']);
        exit;
    }
    
    $stmt = $conn->prepare('SELECT id, nama, alamat, kota, deskripsi FROM toko WHERE seller_id = ?');
    $stmt->bind_param('i', $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $toko = $result->fetch_assoc();
    $stmt->close();
    
    echo json_encode(['success' => true, 'data' => $toko]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonBody();
    
    $seller_id = (int)($data['seller_id'] ?? 0);
    $nama = trim($data['nama'] ?? '');
    $alamat = trim($data['alamat'] ?? '');
    $kota = trim($data['kota'] ?? 'Magelang');
    $toko_id = (int)($data['toko_id'] ?? 0);
    
    if (!$seller_id || !$nama) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'seller_id dan nama toko wajib diisi']);
        exit;
    }
    
    if ($toko_id > 0) {
        // Update toko existing
        $stmt = $conn->prepare('UPDATE toko SET nama = ?, alamat = ?, kota = ? WHERE id = ? AND seller_id = ?');
        $stmt->bind_param('sssii', $nama, $alamat, $kota, $toko_id, $seller_id);
    } else {
        // Insert toko baru
        $stmt = $conn->prepare('INSERT INTO toko (nama, alamat, kota, seller_id) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('sssi', $nama, $alamat, $kota, $seller_id);
    }
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Toko berhasil disimpan']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan toko']);
    }
    $stmt->close();
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);