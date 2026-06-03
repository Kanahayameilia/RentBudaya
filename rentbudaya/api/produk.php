<?php


require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$toko_id = (int)($_GET['toko_id'] ?? 0);

if ($toko_id === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'toko_id diperlukan']);
    exit;
}

$stmt = $conn->prepare(
    'SELECT id, toko_id, nama, deskripsi, harga_per_hari, ukuran, gambar, created_at
     FROM produk
     WHERE toko_id = ?
     ORDER BY nama ASC'
);
$stmt->bind_param('i', $toko_id);
$stmt->execute();
$result = $stmt->get_result();

$produk = [];
while ($row = $result->fetch_assoc()) {
    $produk[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($produk);
