<?php
require_once __DIR__ . '/../api/config.php';

echo "Memulai migrasi database...\n";

$query = "ALTER TABLE produk MODIFY ukuran VARCHAR(50) NOT NULL";

if ($conn->query($query)) {
    echo "SUKSES: Kolom 'ukuran' pada tabel 'produk' berhasil diubah menjadi VARCHAR(50).\n";
} else {
    echo "GAGAL: " . $conn->error . "\n";
}

$conn->close();
?>
