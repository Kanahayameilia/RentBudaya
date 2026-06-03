<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$data = getJsonBody();

$nama     = trim($data['nama']     ?? '');
$email    = trim($data['email']    ?? '');
$password = trim($data['password'] ?? '');
$role     = trim($data['role']     ?? 'customer');
$phone    = trim($data['phone']    ?? '');
$alamat   = trim($data['alamat']   ?? '');

// Validasi role
if ($role !== 'customer' && $role !== 'seller') {
    $role = 'customer';
}

// Validasi dasar
if (!$nama || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nama, email, dan password wajib diisi']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Format email tidak valid']);
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

// Hash password
$hash = password_hash($password, PASSWORD_DEFAULT);

// Simpan ke database (termasuk phone dan alamat)
$stmt = $conn->prepare('INSERT INTO users (nama, email, password, phone, alamat, role) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->bind_param('ssssss', $nama, $email, $hash, $phone, $alamat, $role);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    echo json_encode([
        'success' => true,
        'message' => 'Pendaftaran berhasil',
        'role' => $role,
        'user' => [
            'id'     => $userId,
            'nama'   => $nama,
            'email'  => $email,
            'phone'  => $phone,
            'alamat' => $alamat,
            'role'   => $role
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>