-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 08 Apr 2026 pada 10.26
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rentbudaya`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id` int(10) UNSIGNED NOT NULL,
  `pesanan_id` int(10) UNSIGNED NOT NULL,
  `metode` varchar(50) DEFAULT NULL,
  `status` enum('menunggu','lunas','gagal') NOT NULL DEFAULT 'menunggu',
  `waktu_bayar` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pembayaran`
--

INSERT INTO `pembayaran` (`id`, `pesanan_id`, `metode`, `status`, `waktu_bayar`, `created_at`) VALUES
(1, 1, 'QRIS', 'lunas', '2026-04-08 10:19:02', '2026-04-08 15:18:59'),
(2, 2, 'QRIS', 'menunggu', NULL, '2026-04-08 15:24:59'),
(3, 3, 'QRIS', 'lunas', '2026-04-08 10:25:22', '2026-04-08 15:25:17');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pesanan`
--

CREATE TABLE `pesanan` (
  `id` int(10) UNSIGNED NOT NULL,
  `nomor_pesanan` varchar(20) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `produk_id` int(10) UNSIGNED NOT NULL,
  `model` varchar(50) NOT NULL,
  `warna` varchar(50) NOT NULL,
  `ukuran` enum('S','M','L','XL','XXL') NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `durasi_hari` tinyint(3) UNSIGNED NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  `status` enum('menunggu_pembayaran','pembayaran_dikonfirmasi','diproses','siap_diambil','dikembalikan','selesai','dibatalkan') NOT NULL DEFAULT 'menunggu_pembayaran',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `pesanan`
--

INSERT INTO `pesanan` (`id`, `nomor_pesanan`, `user_id`, `produk_id`, `model`, `warna`, `ukuran`, `tanggal_mulai`, `tanggal_selesai`, `durasi_hari`, `total_harga`, `status`, `created_at`, `updated_at`) VALUES
(1, 'RB653403', 3, 14, 'Wanita', 'Hitam', 'L', '2026-05-01', '2026-05-03', 3, 660000.00, 'pembayaran_dikonfirmasi', '2026-04-08 15:18:59', '2026-04-08 15:19:02'),
(2, 'RB671682', 6, 15, 'Wanita', 'Hijau', 'M', '2026-04-08', '2026-04-10', 3, 930000.00, 'menunggu_pembayaran', '2026-04-08 15:24:59', '2026-04-08 15:24:59'),
(3, 'RB116185', 6, 15, 'Pria', 'Hitam', 'M', '2026-04-15', '2026-04-17', 3, 930000.00, 'pembayaran_dikonfirmasi', '2026-04-08 15:25:17', '2026-04-08 15:25:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `produk`
--

CREATE TABLE `produk` (
  `id` int(10) UNSIGNED NOT NULL,
  `toko_id` int(10) UNSIGNED NOT NULL,
  `nama` varchar(150) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `harga_per_hari` decimal(10,2) NOT NULL,
  `ukuran` enum('S','M','L','XL','XXL') NOT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `produk`
--

INSERT INTO `produk` (`id`, `toko_id`, `nama`, `deskripsi`, `harga_per_hari`, `ukuran`, `gambar`, `created_at`) VALUES
(1, 1, 'Kebaya Brokat S', 'Kebaya brokat mewah untuk pengantin.', 450000.00, 'S', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(2, 1, 'Kebaya Encim S', 'Kebaya encim batik khas.', 280000.00, 'S', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(3, 1, 'Baju Adat S', 'Baju adat lengkap untuk acara formal.', 180000.00, 'S', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(4, 4, 'Kebaya Beskap Jawa', 'Kebaya tradisional Jawa klasik.', 41000.00, 'M', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(5, 4, 'Beskap Putih Polos', 'Beskap putih cocok untuk acara formal.', 120000.00, 'M', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(6, 4, 'Jas Adat M', 'Jas adat Indonesia berkualitas.', 380000.00, 'M', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(7, 4, 'Kebaya Beskap Solo', 'Kebaya Beludru dan Beskap Jawa bernuansa hitam emas.', 91000.00, 'L', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(8, 2, 'Baju Adat Bali', 'Baju adat Bali lengkap dengan aksesoris.', 350000.00, 'L', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(9, 3, 'Jawa Jawi Kebaya', 'Kebaya modern sentuhan Jawa.', 180000.00, 'XL', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(10, 3, 'Jas Adat XL', 'Jas adat premium kualitas tinggi.', 420000.00, 'XL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(11, 5, 'Jas Adat Indonesia', 'Jas adat Indonesia berkualitas tinggi.', 380000.00, 'XXL', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(12, 5, 'Baju Adat XXL', 'Baju adat exclusive XXL.', 500000.00, 'XXL', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(13, 6, 'Kebaya Modern', 'Kebaya modern terbaru.', 95000.00, 'S', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(14, 6, 'Beskap Premium', 'Beskap premium berkualitas.', 220000.00, 'L', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(15, 2, 'Kebaya Cantik', 'Kebaya cantik untuk acara pernikahan.', 310000.00, 'M', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(16, 3, 'Jas Formal', 'Jas formal premium.', 480000.00, 'XL', 'imagebiru.jpeg', '2026-04-07 21:31:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `produk_varian`
--

CREATE TABLE `produk_varian` (
  `id` int(10) UNSIGNED NOT NULL,
  `produk_id` int(10) UNSIGNED NOT NULL,
  `tipe` enum('model','warna') NOT NULL,
  `nilai` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `produk_varian`
--

INSERT INTO `produk_varian` (`id`, `produk_id`, `tipe`, `nilai`) VALUES
(1, 1, 'model', 'Wanita'),
(2, 1, 'warna', 'Emas'),
(3, 1, 'warna', 'Putih'),
(4, 1, 'warna', 'Merah'),
(5, 2, 'model', 'Wanita'),
(6, 2, 'warna', 'Biru'),
(7, 2, 'warna', 'Merah'),
(8, 2, 'warna', 'Kuning'),
(9, 3, 'model', 'Pria'),
(10, 3, 'model', 'Wanita'),
(11, 3, 'warna', 'Merah'),
(12, 3, 'warna', 'Hijau'),
(13, 4, 'model', 'Pria'),
(14, 4, 'model', 'Wanita'),
(15, 4, 'warna', 'Hitam'),
(16, 4, 'warna', 'Merah'),
(17, 4, 'warna', 'Biru'),
(18, 5, 'model', 'Pria'),
(19, 5, 'warna', 'Putih'),
(20, 6, 'model', 'Pria'),
(21, 6, 'warna', 'Hitam'),
(22, 6, 'warna', 'Abu'),
(23, 7, 'model', 'Pria'),
(24, 7, 'model', 'Wanita'),
(25, 7, 'warna', 'Hitam'),
(26, 7, 'warna', 'Biru'),
(27, 7, 'warna', 'Hijau'),
(28, 8, 'model', 'Pria'),
(29, 8, 'model', 'Wanita'),
(30, 8, 'warna', 'Merah'),
(31, 8, 'warna', 'Hijau'),
(32, 8, 'warna', 'Emas'),
(33, 9, 'model', 'Wanita'),
(34, 9, 'warna', 'Pink'),
(35, 9, 'warna', 'Merah'),
(36, 9, 'warna', 'Biru'),
(37, 10, 'model', 'Pria'),
(38, 10, 'warna', 'Hitam'),
(39, 10, 'warna', 'Abu'),
(40, 11, 'model', 'Pria'),
(41, 11, 'warna', 'Hitam'),
(42, 11, 'warna', 'Abu'),
(43, 12, 'model', 'Pria'),
(44, 12, 'warna', 'Merah'),
(45, 12, 'warna', 'Emas'),
(46, 13, 'model', 'Wanita'),
(47, 13, 'warna', 'Pink'),
(48, 13, 'warna', 'Biru'),
(49, 14, 'model', 'Pria'),
(50, 14, 'warna', 'Hitam'),
(51, 14, 'warna', 'Abu'),
(52, 15, 'model', 'Wanita'),
(53, 15, 'warna', 'Merah'),
(54, 15, 'warna', 'Pink'),
(55, 16, 'model', 'Pria'),
(56, 16, 'warna', 'Hitam');

-- --------------------------------------------------------

--
-- Struktur dari tabel `toko`
--

CREATE TABLE `toko` (
  `id` int(10) UNSIGNED NOT NULL,
  `nama` varchar(150) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `kota` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `toko`
--

INSERT INTO `toko` (`id`, `nama`, `alamat`, `kota`, `deskripsi`, `created_at`) VALUES
(1, 'Toko Baju Daerah', 'Jl. Ahmad Yani No.45', 'Magelang', NULL, '2026-04-07 21:31:14'),
(2, 'Rental Kebaya Modern', 'Jl. Thamrin No.49', 'Magelang', NULL, '2026-04-07 21:31:14'),
(3, 'Batik Heritage Store', 'Jl. Asia Afrika No.78', 'Magelang', NULL, '2026-04-07 21:31:14'),
(4, 'Toko Adat Jaya', 'Jl. Gatot Subroto No.234', 'Magelang', NULL, '2026-04-07 21:31:14'),
(5, 'Sewa Baju Pengantin Adat', 'Jl. Diponegoro No.56', 'Magelang', NULL, '2026-04-07 21:31:14'),
(6, 'Butik Hana', 'Jl. Sudirman No.123', 'Magelang', NULL, '2026-04-07 21:31:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `alamat` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `alamat`, `created_at`, `updated_at`) VALUES
(2, 'assep.wahid', 'assep.wahid@students.untidar.ac.id', '$2y$10$ShSvxEw6mZu.Kj9GlydXNurc6/sGBD0aZkLcAdW4tsvA5jV94x6/K', 'jakarta', '2026-04-07 22:04:17', '2026-04-07 22:07:57'),
(3, 'wahidassep', 'wahidassep@gmail.com', '$2y$10$u4MDOXzq5WFaafWTsgkmU.zjMpAqpljx27dVoNwA43ttrp8Pgszri', NULL, '2026-04-07 22:50:27', '2026-04-07 22:50:27'),
(4, 'contoh', 'contoh@gmail.com', '$2y$10$5BplgeZQIOofugY5XjKA5ep10CaI2Mt3bfx/Tgr2PklrBjvg3Xx7W', NULL, '2026-04-08 15:21:07', '2026-04-08 15:21:07'),
(6, 'faiz', 'faiz@gmail.com', '$2y$10$TBOs1JMlU1I3yVZ0S7H0v.MqcAdMpI9u3.qIgcUhBRlCr5NIJReXe', NULL, '2026-04-08 15:22:33', '2026-04-08 15:22:33');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pesanan_id` (`pesanan_id`);

--
-- Indeks untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_pesanan` (`nomor_pesanan`),
  ADD KEY `fk_pesanan_produk` (`produk_id`),
  ADD KEY `idx_pesanan_user` (`user_id`),
  ADD KEY `idx_pesanan_status` (`status`),
  ADD KEY `idx_pesanan_nomor` (`nomor_pesanan`);

--
-- Indeks untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_produk_toko` (`toko_id`),
  ADD KEY `idx_produk_ukuran` (`ukuran`);

--
-- Indeks untuk tabel `produk_varian`
--
ALTER TABLE `produk_varian`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_varian_produk` (`produk_id`);

--
-- Indeks untuk tabel `toko`
--
ALTER TABLE `toko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_toko_kota` (`kota`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `produk`
--
ALTER TABLE `produk`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `produk_varian`
--
ALTER TABLE `produk_varian`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT untuk tabel `toko`
--
ALTER TABLE `toko`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `fk_pembayaran_pesanan` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `fk_pesanan_produk` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`),
  ADD CONSTRAINT `fk_pesanan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD CONSTRAINT `fk_produk_toko` FOREIGN KEY (`toko_id`) REFERENCES `toko` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `produk_varian`
--
ALTER TABLE `produk_varian`
  ADD CONSTRAINT `fk_varian_produk` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
