<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$toko_id = (int)($_POST['toko_id'] ?? 0);
$nama = trim($_POST['nama'] ?? '');
$deskripsi = trim($_POST['deskripsi'] ?? '');
$harga = (float)($_POST['harga_per_hari'] ?? 0);
$ukuran = trim($_POST['ukuran'] ?? 'M');

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
    echo json_encode(['success' => false, 'message' => 'Gagal menambah produk']);
}

$stmt->close();
$conn->close();