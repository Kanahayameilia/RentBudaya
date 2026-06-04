<?php

require_once 'config.php';

// Allow GET method only
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

// 1. Get toko_id belonging to the seller
$stmt = $conn->prepare('SELECT id FROM toko WHERE seller_id = ?');
$stmt->bind_param('i', $seller_id);
$stmt->execute();
$tokoResult = $stmt->get_result();
$toko = $tokoResult->fetch_assoc();
$toko_id = $toko['id'] ?? 0;
$stmt->close();

if (!$toko_id) {
    // If seller has no store yet
    echo json_encode([
        'success' => true,
        'data' => [
            'total_orders' => 0,
            'pending_orders' => 0,
            'total_products' => 0
        ]
    ]);
    exit;
}

// 2. Count total products in store
$stmt = $conn->prepare('SELECT COUNT(*) as total FROM produk WHERE toko_id = ?');
$stmt->bind_param('i', $toko_id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$total_products = (int)($res['total'] ?? 0);
$stmt->close();

// 3. Count total orders for the store
$stmt = $conn->prepare(
    'SELECT COUNT(*) as total 
     FROM pesanan p 
     JOIN produk pr ON p.produk_id = pr.id 
     WHERE pr.toko_id = ?'
);
$stmt->bind_param('i', $toko_id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$total_orders = (int)($res['total'] ?? 0);
$stmt->close();

// 4. Count pending orders for the store
$stmt = $conn->prepare(
    'SELECT COUNT(*) as total 
     FROM pesanan p 
     JOIN produk pr ON p.produk_id = pr.id 
     WHERE pr.toko_id = ? AND p.status = "menunggu_pembayaran"'
);
$stmt->bind_param('i', $toko_id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$pending_orders = (int)($res['total'] ?? 0);
$stmt->close();

echo json_encode([
    'success' => true,
    'data' => [
        'total_orders'   => $total_orders,
        'pending_orders' => $pending_orders,
        'total_products' => $total_products
    ]
]);

$conn->close();
?>