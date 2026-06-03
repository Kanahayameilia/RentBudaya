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
$phone        = trim($data['phone']          ?? '');
$passwordBaru = trim($data['password_baru']  ?? '');

// Validasi
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

// Cek email konflik
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

// Update data
if ($passwordBaru) {
    if (strlen($passwordBaru) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Password baru minimal 6 karakter']);
        exit;
    }
    $newHash = password_hash($passwordBaru, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare('UPDATE users SET nama = ?, email = ?, alamat = ?, phone = ?, password = ? WHERE id = ?');
    $stmt->bind_param('sssssi', $nama, $email, $alamat, $phone, $newHash, $userId);
} else {
    $stmt = $conn->prepare('UPDATE users SET nama = ?, email = ?, alamat = ?, phone = ? WHERE id = ?');
    $stmt->bind_param('ssssi', $nama, $email, $alamat, $phone, $userId);
}

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Profil berhasil diperbarui',
        'user' => [
            'id'     => $userId,
            'nama'   => $nama,
            'email'  => $email,
            'alamat' => $alamat,
            'phone'  => $phone
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan perubahan']);
}

$stmt->close();
$conn->close();
?>