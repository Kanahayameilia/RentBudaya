<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$seller_id = (int)($_GET['seller_id'] ?? 0);
$status = trim($_GET['status'] ?? '');
$all = isset($_GET['all']);

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

if (!$toko_id) {
    echo json_encode(['success' => true, 'data' => []]);
    exit;
}

$sql = "SELECT p.*, u.nama as customer_name, pr.nama as nama_produk
        FROM pesanan p 
        JOIN produk pr ON p.produk_id = pr.id 
        JOIN users u ON p.user_id = u.id
        WHERE pr.toko_id = ?";
$params = [$toko_id];
$types = "i";

if (!$all && $status) {
    $sql .= " AND p.status = ?";
    $params[] = $status;
    $types .= "s";
}

$sql .= " ORDER BY p.created_at DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode(['success' => true, 'data' => $orders]);
$stmt->close();
$conn->close();