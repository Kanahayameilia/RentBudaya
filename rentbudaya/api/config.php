<?php
// Konfigurasi Database

define('DB_HOST', 'localhost');
define('DB_USER', 'root');       
define('DB_PASS', '');           
define('DB_NAME', 'rentbudaya');

// Koneksi ke MySQL
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Cek koneksi
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Koneksi database gagal: ' . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset('utf8mb4');

//  CORS Header 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Tangani preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

//  Helper: Ambil body JSON dari request
function getJsonBody() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
