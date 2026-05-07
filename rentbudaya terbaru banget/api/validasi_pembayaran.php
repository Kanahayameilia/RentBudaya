<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$data = getJsonBody();
$nomor_pesanan = trim($data['nomor_pesanan'] ?? '');

if (!$nomor_pesanan) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'nomor_pesanan diperlukan']);
    exit;
}

$conn->begin_transaction();

try {
    // Update status pesanan
    $stmt = $conn->prepare('UPDATE pesanan SET status = "pembayaran_dikonfirmasi" WHERE nomor_pesanan = ?');
    $stmt->bind_param('s', $nomor_pesanan);
    $stmt->execute();
    $stmt->close();
    
    // Ambil pesanan_id
    $stmt = $conn->prepare('SELECT id FROM pesanan WHERE nomor_pesanan = ?');
    $stmt->bind_param('s', $nomor_pesanan);
    $stmt->execute();
    $result = $stmt->get_result();
    $pesanan = $result->fetch_assoc();
    $pesanan_id = $pesanan['id'];
    $stmt->close();
    
    // Update atau insert pembayaran
    $waktu_bayar = date('Y-m-d H:i:s');
    $stmt = $conn->prepare(
        'INSERT INTO pembayaran (pesanan_id, metode, status, waktu_bayar) 
         VALUES (?, "QRIS", "lunas", ?)
         ON DUPLICATE KEY UPDATE status = "lunas", waktu_bayar = ?'
    );
    $stmt->bind_param('iss', $pesanan_id, $waktu_bayar, $waktu_bayar);
    $stmt->execute();
    $stmt->close();
    
    $conn->commit();
    
    echo json_encode(['success' => true, 'message' => 'Pembayaran berhasil divalidasi']);
    
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal validasi: ' . $e->getMessage()]);
}

$conn->close();