<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$data = getJsonBody();

$email    = trim($data['email']    ?? '');
$password = trim($data['password'] ?? '');

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email dan password wajib diisi']);
    exit;
}

// Cari user berdasarkan email
$stmt = $conn->prepare('SELECT id, nama, email, password, alamat, role FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Email belum terdaftar']);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// Verifikasi password
if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Password salah']);
    exit;
}

// Cek apakah role-nya seller
if ($user['role'] !== 'seller') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Akun ini bukan penjual. Silakan login sebagai customer.']);
    exit;
}

// Login berhasil
echo json_encode([
    'success' => true,
    'message' => 'Login berhasil',
    'user' => [
        'id'     => $user['id'],
        'nama'   => $user['nama'],
        'email'  => $user['email'],
        'alamat' => $user['alamat'] ?? '',
        'role'   => $user['role']
    ]
]);

$conn->close();