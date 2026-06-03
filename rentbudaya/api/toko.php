<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$kota      = trim($_GET['kota']      ?? '');
$ukuran    = trim($_GET['ukuran']    ?? '');
$harMin    = (float)($_GET['harga_min'] ?? 0);
$harMax    = (float)($_GET['harga_max'] ?? 0);
$tokoId    = (int)($_GET['toko_id']  ?? 0);


$tokoSql = 'SELECT id, nama, alamat, kota, deskripsi FROM toko WHERE 1=1';
$tokoParams = [];
$tokoTypes  = '';

if ($kota) {
    $tokoSql .= ' AND kota = ?';
    $tokoParams[] = $kota;
    $tokoTypes   .= 's';
}
if ($tokoId) {
    $tokoSql .= ' AND id = ?';
    $tokoParams[] = $tokoId;
    $tokoTypes   .= 'i';
}
$tokoSql .= ' ORDER BY nama ASC';

$stmtToko = $conn->prepare($tokoSql);
if ($tokoTypes) {
    $stmtToko->bind_param($tokoTypes, ...$tokoParams);
}
$stmtToko->execute();
$tokoResult = $stmtToko->get_result();

$tokoList = [];
while ($toko = $tokoResult->fetch_assoc()) {
    $tokoList[$toko['id']] = [
        'id'       => $toko['id'],
        'nama'     => $toko['nama'],
        'alamat'   => $toko['alamat'],
        'kota'     => $toko['kota'],
        'deskripsi'=> $toko['deskripsi'],
        'produk'   => []
    ];
}
$stmtToko->close();

if (empty($tokoList)) {
    echo json_encode(['success' => true, 'data' => []]);
    exit;
}


$tokoIds      = array_keys($tokoList);
$placeholders = implode(',', array_fill(0, count($tokoIds), '?'));
$types        = str_repeat('i', count($tokoIds));

$produkSql    = "SELECT id, toko_id, nama, deskripsi, harga_per_hari, ukuran, gambar
                 FROM produk
                 WHERE toko_id IN ($placeholders)";
$produkParams = $tokoIds;
$produkTypes  = $types;

if ($ukuran) {
    $produkSql    .= ' AND ukuran = ?';
    $produkParams[] = $ukuran;
    $produkTypes   .= 's';
}
if ($harMin > 0) {
    $produkSql    .= ' AND harga_per_hari >= ?';
    $produkParams[] = $harMin;
    $produkTypes   .= 'd';
}
if ($harMax > 0) {
    $produkSql    .= ' AND harga_per_hari <= ?';
    $produkParams[] = $harMax;
    $produkTypes   .= 'd';
}
$produkSql .= ' ORDER BY nama ASC';

$stmtProduk = $conn->prepare($produkSql);
$stmtProduk->bind_param($produkTypes, ...$produkParams);
$stmtProduk->execute();
$produkResult = $stmtProduk->get_result();

$produkList = [];
while ($p = $produkResult->fetch_assoc()) {
    $p['varian'] = ['model' => [], 'warna' => []];
    $produkList[$p['id']] = $p;

    // Masukkan ke toko yang sesuai
    if (isset($tokoList[$p['toko_id']])) {
        $tokoList[$p['toko_id']]['produk'][] = &$produkList[$p['id']];
    }
}
$stmtProduk->close();


if (!empty($produkList)) {
    $produkIds    = array_keys($produkList);
    $ph2          = implode(',', array_fill(0, count($produkIds), '?'));
    $types2       = str_repeat('i', count($produkIds));

    $stmtVar = $conn->prepare(
        "SELECT produk_id, tipe, nilai FROM produk_varian WHERE produk_id IN ($ph2)"
    );
    $stmtVar->bind_param($types2, ...$produkIds);
    $stmtVar->execute();
    $varResult = $stmtVar->get_result();

    while ($v = $varResult->fetch_assoc()) {
        $pid  = $v['produk_id'];
        $tipe = $v['tipe']; // 'model' atau 'warna'
        if (isset($produkList[$pid])) {
            $produkList[$pid]['varian'][$tipe][] = $v['nilai'];
        }
    }
    $stmtVar->close();
}

//  Kembalikan data (reset referensi PHP agar tidak bocor)
$output = array_values($tokoList);
foreach ($output as &$t) {
    $t['produk'] = array_values($t['produk']);
}

echo json_encode(['success' => true, 'data' => $output]);

$conn->close();
