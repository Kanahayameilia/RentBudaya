<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$data = getJsonBody();

$userId       = (int)($data['user_id']       ?? 0);
$nama         = trim($data['nama']           ?? '');
$email        = trim($data['email']          ?? '');
$alamat       = trim($data['alamat']         ?? '');
$passwordLama = trim($data['password_lama']  ?? '');
$passwordBaru = trim($data['password_baru']  ?? '');

// --- Validasi ---
if (!$userId || !$nama || !$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID, nama, dan email wajib diisi']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Format email tidak valid']);
    exit;
}

// --- Ambil data user saat ini ---
$stmt = $conn->prepare('SELECT id, password FROM users WHERE id = ?');
$stmt->bind_param('i', $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'User tidak ditemukan']);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// --- Cek email konflik dengan user lain ---
$stmt = $conn->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
$stmt->bind_param('si', $email, $userId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Email sudah digunakan akun lain']);
    $stmt->close();
    exit;
}
$stmt->close();

// --- Update password jika diisi ---
$newHash = $user['password']; 

if ($passwordBaru) {
    if (!$passwordLama) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Masukkan password lama untuk mengubah password']);
        exit;
    }
    if (!password_verify($passwordLama, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Password lama salah']);
        exit;
    }
    if (strlen($passwordBaru) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Password baru minimal 6 karakter']);
        exit;
    }
    $newHash = password_hash($passwordBaru, PASSWORD_DEFAULT);
}

// --- Simpan perubahan ---
$stmt = $conn->prepare('UPDATE users SET nama = ?, email = ?, alamat = ?, password = ? WHERE id = ?');
$stmt->bind_param('ssssi', $nama, $email, $alamat, $newHash, $userId);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Profil berhasil diperbarui',
        'user' => [
            'id'     => $userId,
            'nama'   => $nama,
            'email'  => $email,
            'alamat' => $alamat
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan perubahan']);
}

$stmt->close();
$conn->close();
