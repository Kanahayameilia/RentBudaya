<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

// Ambil data dari FormData (bukan JSON karena upload file)
$ownerName = trim($_POST['owner_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$password = trim($_POST['password'] ?? '');
$storeName = trim($_POST['store_name'] ?? '');
$city = trim($_POST['city'] ?? '');
$address = trim($_POST['address'] ?? '');
$categories = json_decode($_POST['categories'] ?? '[]', true);
$otherCategory = trim($_POST['other_category'] ?? '');
$storeDescription = trim($_POST['store_description'] ?? '');

// Validasi
if (!$ownerName || !$email || !$phone || !$password || !$storeName || !$city || !$address) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Semua field wajib diisi']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email tidak valid']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password minimal 6 karakter']);
    exit;
}

// Cek email sudah terdaftar
$stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Email sudah terdaftar']);
    $stmt->close();
    exit;
}
$stmt->close();

// Upload directory
$uploadDir = __DIR__ . '/../uploads/penjual/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Upload KTP
$ktpPath = '';
if (isset($_FILES['ktp_file']) && $_FILES['ktp_file']['error'] === 0) {
    $ext = pathinfo($_FILES['ktp_file']['name'], PATHINFO_EXTENSION);
    $ktpPath = 'ktp_' . time() . '_' . uniqid() . '.' . $ext;
    move_uploaded_file($_FILES['ktp_file']['tmp_name'], $uploadDir . $ktpPath);
}

// Upload Foto Toko
$storePhotoPath = '';
if (isset($_FILES['store_photo']) && $_FILES['store_photo']['error'] === 0) {
    $ext = pathinfo($_FILES['store_photo']['name'], PATHINFO_EXTENSION);
    $storePhotoPath = 'toko_' . time() . '_' . uniqid() . '.' . $ext;
    move_uploaded_file($_FILES['store_photo']['tmp_name'], $uploadDir . $storePhotoPath);
}

// Hash password
$hash = password_hash($password, PASSWORD_DEFAULT);

// Mulai transaksi
$conn->begin_transaction();

try {
    // Insert user dengan role seller
    $stmt = $conn->prepare('INSERT INTO users (nama, email, password, phone, alamat, role) VALUES (?, ?, ?, ?, ?, "seller")');
    $stmt->bind_param('sssss', $ownerName, $email, $hash, $phone, $address);
    $stmt->execute();
    $sellerId = $conn->insert_id;
    $stmt->close();
    
    // Insert toko
    $stmt = $conn->prepare('INSERT INTO toko (nama, alamat, kota, deskripsi, seller_id) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssi', $storeName, $address, $city, $storeDescription, $sellerId);
    $stmt->execute();
    $tokoId = $conn->insert_id;
    $stmt->close();
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Pendaftaran penjual berhasil, menunggu verifikasi',
        'user_id' => $sellerId,
        'toko_id' => $tokoId
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal mendaftar: ' . $e->getMessage()]);
}

$conn->close();
?>