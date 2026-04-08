<?php
// ============================================================
//  POST /api/daftar.php
//  Mendaftarkan akun pengguna baru
//  Body: { nama, email, password }
// ============================================================

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

// --- Validasi dasar ---
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

// --- Cek email sudah terdaftar ---
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

// --- Simpan ke database ---
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare('INSERT INTO users (nama, email, password) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $nama, $email, $hash);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    echo json_encode([
        'success' => true,
        'message' => 'Pendaftaran berhasil',
        'user' => [
            'id'    => $userId,
            'nama'  => $nama,
            'email' => $email
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data']);
}

$stmt->close();
$conn->close();
