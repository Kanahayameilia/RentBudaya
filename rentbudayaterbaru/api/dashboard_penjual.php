<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$seller_id = (int)($_GET['seller_id'] ?? 0);

if (!$seller_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'seller_id diperlukan']);
    exit;
}

// Ambil toko milik seller
$stmt = $conn->prepare('SELECT id FROM toko WHERE seller_id = ?');
$stmt->bind_param('i', $seller_id);
$stmt->execute();
$tokoResult = $stmt->get_result();
$toko = $tokoResult->fetch_assoc();
$toko_id = $toko['id'] ?? 0;
$stmt->close();

$response = [
    'total_orders' => 0,
    'pending_orders' => 0,
    'total_products' => 0
];

if ($toko_id) {
    // Total pesanan
    $stmt = $conn->prepare(
        'SELECT COUNT(*) as cnt FROM pesanan p 
         JOIN produk pr ON p.produk_id = pr.id 
         WHERE pr.toko_id = ?'
    );
    $stmt->bind_param('i', $toko_id);
    $stmt->execute();
    $response['total_orders'] = $stmt->get_result()->fetch_assoc()['cnt'];
    $stmt->close();

    // Pesanan menunggu validasi
    $stmt = $conn->prepare(
        'SELECT COUNT(*) as cnt FROM pesanan p 
         JOIN produk pr ON p.produk_id = pr.id 
         WHERE pr.toko_id = ? AND p.status = "menunggu_pembayaran"'
    );
    $stmt->bind_param('i', $toko_id);
    $stmt->execute();
    $response['pending_orders'] = $stmt->get_result()->fetch_assoc()['cnt'];
    $stmt->close();

    // Total produk
    $stmt = $conn->prepare('SELECT COUNT(*) as cnt FROM produk WHERE toko_id = ?');
    $stmt->bind_param('i', $toko_id);
    $stmt->execute();
    $response['total_products'] = $stmt->get_result()->fetch_assoc()['cnt'];
    $stmt->close();
}

echo json_encode(['success' => true, 'data' => $response]);
$conn->close();