-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 03 Jun 2026 pada 13.36
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
(1, 1, 'QRIS', 'lunas', '2026-04-08 11:51:51', '2026-04-08 16:51:46'),
(2, 2, 'QRIS', 'lunas', '2026-04-08 13:07:03', '2026-04-08 18:06:59'),
(3, 3, 'QRIS', 'lunas', '2026-04-08 13:20:30', '2026-04-08 18:20:28'),
(4, 4, 'QRIS', 'lunas', '2026-04-08 13:35:32', '2026-04-08 18:35:30'),
(5, 5, 'QRIS', 'lunas', '2026-04-08 13:38:28', '2026-04-08 18:38:27'),
(6, 6, 'QRIS', 'lunas', '2026-04-08 13:57:40', '2026-04-08 18:57:38'),
(7, 7, 'QRIS', 'lunas', '2026-04-08 14:07:13', '2026-04-08 19:07:06'),
(8, 8, 'QRIS', 'lunas', '2026-04-08 14:09:03', '2026-04-08 19:09:00'),
(9, 9, 'QRIS', 'lunas', '2026-04-08 14:32:30', '2026-04-08 19:31:50'),
(10, 10, 'QRIS', 'lunas', '2026-04-08 14:33:30', '2026-04-08 19:33:28'),
(11, 11, 'QRIS', 'lunas', '2026-04-09 04:45:08', '2026-04-09 09:45:04'),
(12, 12, 'QRIS', 'lunas', '2026-04-09 04:46:25', '2026-04-09 09:46:07'),
(13, 13, 'QRIS', 'lunas', '2026-04-09 05:49:29', '2026-04-09 10:49:04'),
(14, 14, 'QRIS', 'lunas', '2026-04-30 04:59:45', '2026-04-30 09:59:39'),
(15, 15, 'QRIS', 'lunas', '2026-04-30 05:01:31', '2026-04-30 10:01:29'),
(16, 16, 'QRIS', 'lunas', '2026-05-06 19:00:07', '2026-05-07 00:00:06'),
(17, 17, 'QRIS', 'lunas', '2026-05-06 19:45:21', '2026-05-07 00:45:19'),
(18, 18, 'QRIS', 'lunas', '2026-05-07 05:01:08', '2026-05-07 10:01:06');

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
(1, 'RB690100', 2, 1, 'Wanita', 'Biru', 'S', '2026-04-21', '2026-04-23', 3, 1350000.00, 'pembayaran_dikonfirmasi', '2026-04-08 16:51:46', '2026-04-08 16:51:51'),
(2, 'RB746775', 2, 35, 'Pria', 'Biru', 'S', '2026-04-08', '2026-04-10', 3, 1230000.00, 'pembayaran_dikonfirmasi', '2026-04-08 18:06:59', '2026-04-08 18:07:03'),
(3, 'RB052204', 2, 35, 'Pria', 'Biru', 'S', '2026-04-29', '2026-05-01', 3, 1230000.00, 'pembayaran_dikonfirmasi', '2026-04-08 18:20:28', '2026-04-08 18:20:30'),
(4, 'RB571028', 2, 39, 'Pria', 'Biru', 'L', '2026-04-15', '2026-04-17', 3, 1320000.00, 'pembayaran_dikonfirmasi', '2026-04-08 18:35:30', '2026-04-08 18:35:32'),
(5, 'RB211371', 2, 39, 'Pria', 'Biru', 'L', '2026-04-22', '2026-04-24', 3, 1320000.00, 'pembayaran_dikonfirmasi', '2026-04-08 18:38:27', '2026-04-08 18:38:28'),
(6, 'RB321659', 2, 35, 'Wanita', 'Hijau', 'S', '2026-04-08', '2026-04-10', 3, 1230000.00, 'pembayaran_dikonfirmasi', '2026-04-08 18:57:38', '2026-04-08 18:57:40'),
(7, 'RB281112', 2, 35, 'Wanita', 'Hijau', 'S', '2026-04-15', '2026-04-17', 3, 1230000.00, 'pembayaran_dikonfirmasi', '2026-04-08 19:07:06', '2026-04-08 19:07:13'),
(8, 'RB763173', 2, 39, 'Pria', 'Biru', 'L', '2026-04-29', '2026-05-01', 3, 1320000.00, 'pembayaran_dikonfirmasi', '2026-04-08 19:09:00', '2026-04-08 19:09:03'),
(9, 'RB297128', 3, 35, 'Wanita', 'Hijau', 'S', '2026-04-15', '2026-04-17', 3, 1230000.00, 'pembayaran_dikonfirmasi', '2026-04-08 19:31:50', '2026-04-08 19:32:30'),
(10, 'RB065093', 3, 35, 'Wanita', 'Hitam', 'S', '2026-04-08', '2026-04-10', 3, 1230000.00, 'pembayaran_dikonfirmasi', '2026-04-08 19:33:28', '2026-04-08 19:33:30'),
(11, 'RB367298', 4, 39, 'Wanita', 'Hitam', 'L', '2026-04-09', '2026-04-11', 3, 1320000.00, 'pembayaran_dikonfirmasi', '2026-04-09 09:45:04', '2026-04-09 09:45:08'),
(12, 'RB709081', 4, 35, 'Wanita', 'Hijau', 'S', '2026-04-09', '2026-04-11', 3, 1230000.00, 'pembayaran_dikonfirmasi', '2026-04-09 09:46:07', '2026-04-09 09:46:25'),
(13, 'RB708837', 5, 35, 'Wanita', 'Hitam', 'S', '2026-04-09', '2026-04-11', 3, 1230000.00, 'pembayaran_dikonfirmasi', '2026-04-09 10:49:04', '2026-04-09 10:49:29'),
(14, 'RB705386', 4, 10, 'Pria', 'Biru', 'XL', '2026-04-30', '2026-05-02', 3, 1260000.00, 'pembayaran_dikonfirmasi', '2026-04-30 09:59:39', '2026-04-30 09:59:45'),
(15, 'RB878479', 4, 8, 'Wanita', 'Hijau', 'L', '2026-04-30', '2026-05-01', 2, 700000.00, 'pembayaran_dikonfirmasi', '2026-04-30 10:01:29', '2026-04-30 10:01:31'),
(16, 'RB293551', 6, 39, 'Pria', 'Hijau', 'L', '2026-05-06', '2026-05-08', 3, 1320000.00, 'pembayaran_dikonfirmasi', '2026-05-07 00:00:06', '2026-05-07 00:00:07'),
(17, 'RB367768', 3, 53, 'Wanita', 'Hijau', 'L', '2026-05-07', '2026-05-09', 3, 1560000.00, 'pembayaran_dikonfirmasi', '2026-05-07 00:45:19', '2026-05-07 00:45:21'),
(18, 'RB847115', 4, 39, 'Pria', 'Hitam', 'L', '2026-05-07', '2026-05-09', 3, 1320000.00, 'pembayaran_dikonfirmasi', '2026-05-07 10:01:06', '2026-05-07 10:01:08');

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
(1, 1, 'Kebaya Brokat ', 'Kebaya brokat mewah untuk pengantin.', 450000.00, 'S', 'imagekebaya.jpeg', '2026-04-08 15:13:15'),
(2, 1, 'Kebaya Encim S', 'Kebaya encim batik khas.', 280000.00, 'S', 'imagebiru.jpeg', '2026-04-08 15:13:15'),
(3, 1, 'Baju Adat S', 'Baju adat lengkap untuk acara formal.', 180000.00, 'S', 'imagehijau.jpeg', '2026-04-08 15:13:15'),
(4, 4, 'Kebaya Beskap Jawa', 'Kebaya tradisional Jawa klasik.', 41000.00, 'M', 'imageproduk.jpeg', '2026-04-08 15:13:15'),
(5, 4, 'Beskap Putih Polos', 'Beskap putih cocok untuk acara formal.', 120000.00, 'M', 'imagebiru.jpeg', '2026-04-08 15:13:15'),
(6, 4, 'Jas Adat M', 'Jas adat Indonesia berkualitas.', 380000.00, 'M', 'imagehijau.jpeg', '2026-04-08 15:13:15'),
(7, 4, 'Kebaya Beskap Solo', 'Kebaya Beludru dan Beskap Jawa bernuansa hitam emas.', 91000.00, 'L', 'imagebiru.jpeg', '2026-04-08 15:13:15'),
(8, 2, 'Baju Adat Bali', 'Baju adat Bali lengkap dengan aksesoris.', 350000.00, 'L', 'imagehijau.jpeg', '2026-04-08 15:13:15'),
(9, 3, 'Jawa Jawi Kebaya', 'Kebaya modern sentuhan Jawa.', 180000.00, 'XL', 'imageproduk.jpeg', '2026-04-08 15:13:15'),
(10, 3, 'Jas Adat XL', 'Jas adat premium kualitas tinggi.', 420000.00, 'XL', 'imagebiru.jpeg', '2026-04-08 15:13:15'),
(11, 5, 'Jas Adat Indonesia', 'Jas adat Indonesia berkualitas tinggi.', 380000.00, 'XXL', 'imageproduk.jpeg', '2026-04-08 15:13:15'),
(12, 5, 'Baju Adat XXL', 'Baju adat exclusive XXL.', 500000.00, 'XXL', 'imagehijau.jpeg', '2026-04-08 15:13:15'),
(13, 6, 'Kebaya Modern', 'Kebaya modern terbaru.', 95000.00, 'S', 'imagebiru.jpeg', '2026-04-08 15:13:15'),
(14, 6, 'Beskap Premium', 'Beskap premium berkualitas.', 220000.00, 'L', 'imageproduk.jpeg', '2026-04-08 15:13:15'),
(15, 2, 'Kebaya Cantik', 'Kebaya cantik untuk acara pernikahan.', 310000.00, 'M', 'imagehijau.jpeg', '2026-04-08 15:13:15'),
(16, 3, 'Jas Formal', 'Jas formal premium.', 480000.00, 'XL', 'imagebiru.jpeg', '2026-04-08 15:13:15'),
(17, 1, 'Kebaya Brokat M', 'Kebaya brokat elegan ukuran M.', 460000.00, 'M', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(18, 1, 'Kebaya Encim M', 'Kebaya encim modern ukuran M.', 290000.00, 'M', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(19, 1, 'Baju Adat M', 'Baju adat formal ukuran M.', 190000.00, 'M', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(20, 1, 'Kebaya Brokat L', 'Kebaya brokat mewah ukuran L.', 470000.00, 'L', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(21, 1, 'Kebaya Encim L', 'Kebaya encim batik ukuran L.', 300000.00, 'L', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(22, 1, 'Baju Adat L', 'Baju adat lengkap ukuran L.', 200000.00, 'L', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(23, 1, 'Kebaya Brokat XL', 'Kebaya brokat premium ukuran XL.', 480000.00, 'XL', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(24, 1, 'Kebaya Encim XL', 'Kebaya encim exclusive ukuran XL.', 310000.00, 'XL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(25, 1, 'Baju Adat XL', 'Baju adat ukuran XL.', 210000.00, 'XL', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(26, 1, 'Kebaya Brokat XXL', 'Kebaya brokat ukuran XXL.', 490000.00, 'XXL', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(27, 1, 'Kebaya Encim XXL', 'Kebaya encim ukuran XXL.', 320000.00, 'XXL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(28, 2, 'Baju Adat Bali S', 'Baju adat Bali ukuran S.', 340000.00, 'S', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(29, 2, 'Kebaya Bali S', 'Kebaya khas Bali ukuran S.', 330000.00, 'S', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(30, 2, 'Baju Adat Bali XL', 'Baju adat Bali ukuran XL.', 360000.00, 'XL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(31, 2, 'Kebaya Bali XL', 'Kebaya Bali modern ukuran XL.', 370000.00, 'XL', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(32, 2, 'Baju Adat Bali XXL', 'Baju adat Bali ukuran XXL.', 380000.00, 'XXL', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(33, 2, 'Kebaya Bali XXL', 'Kebaya Bali ukuran XXL.', 390000.00, 'XXL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(34, 3, 'Jawa Jawi Kebaya S', 'Kebaya modern ukuran S.', 170000.00, 'S', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(35, 3, 'Jas Adat S', 'Jas adat ukuran S.', 410000.00, 'S', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(36, 3, 'Jawa Jawi Kebaya M', 'Kebaya modern ukuran M.', 190000.00, 'M', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(37, 3, 'Jas Adat M', 'Jas adat ukuran M.', 430000.00, 'M', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(38, 3, 'Jawa Jawi Kebaya L', 'Kebaya modern ukuran L.', 200000.00, 'L', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(39, 3, 'Jas Adat L', 'Jas adat ukuran L.', 440000.00, 'L', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(40, 3, 'Jawa Jawi Kebaya XXL', 'Kebaya modern ukuran XXL.', 220000.00, 'XXL', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(41, 3, 'Jas Adat XXL', 'Jas adat ukuran XXL.', 460000.00, 'XXL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(42, 4, 'Kebaya Beskap S', 'Kebaya tradisional ukuran S.', 40000.00, 'S', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(43, 4, 'Beskap Putih S', 'Beskap putih ukuran S.', 110000.00, 'S', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(44, 4, 'Kebaya Beskap XL', 'Kebaya beludru ukuran XL.', 93000.00, 'XL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(45, 4, 'Beskap Hitam XL', 'Beskap hitam elegan ukuran XL.', 130000.00, 'XL', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(46, 4, 'Kebaya Beskap XXL', 'Kebaya solo ukuran XXL.', 95000.00, 'XXL', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(47, 4, 'Beskap Coklat XXL', 'Beskap coklat premium ukuran XXL.', 140000.00, 'XXL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(48, 5, 'Jas Adat S', 'Jas adat Indonesia ukuran S.', 370000.00, 'S', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(49, 5, 'Baju Adat S', 'Baju adat exclusive ukuran S.', 490000.00, 'S', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(50, 5, 'Jas Adat M', 'Jas adat Indonesia ukuran M.', 390000.00, 'M', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(51, 5, 'Baju Adat M', 'Baju adat exclusive ukuran M.', 510000.00, 'M', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(52, 5, 'Jas Adat L', 'Jas adat Indonesia ukuran L.', 400000.00, 'L', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(53, 5, 'Baju Adat L', 'Baju adat exclusive ukuran L.', 520000.00, 'L', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(54, 5, 'Jas Adat XL', 'Jas adat Indonesia ukuran XL.', 410000.00, 'XL', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(55, 5, 'Baju Adat XL', 'Baju adat exclusive ukuran XL.', 530000.00, 'XL', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(56, 6, 'Kebaya Modern M', 'Kebaya modern terbaru ukuran M.', 100000.00, 'M', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(57, 6, 'Beskap Premium M', 'Beskap premium ukuran M.', 230000.00, 'M', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(58, 6, 'Kebaya Modern XL', 'Kebaya modern ukuran XL.', 105000.00, 'XL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(59, 6, 'Beskap Premium XL', 'Beskap premium ukuran XL.', 240000.00, 'XL', 'imageproduk.jpeg', '2026-04-07 21:31:14'),
(60, 6, 'Kebaya Modern XXL', 'Kebaya modern ukuran XXL.', 110000.00, 'XXL', 'imagehijau.jpeg', '2026-04-07 21:31:14'),
(61, 6, 'Beskap Premium XXL', 'Beskap premium ukuran XXL.', 250000.00, 'XXL', 'imagebiru.jpeg', '2026-04-07 21:31:14'),
(62, 7, 'baju pengantin', 'baju pengantin pria dan wanita', 500.00, 'XL', '1778089374_69fb7d9e4c1ff.jpeg', '2026-05-07 00:42:54'),
(63, 8, 'baju blangkon', 'blankon khas jawa', 200.00, 'XXL', '1778126936_69fc1058415eb.jpeg', '2026-05-07 11:08:56');

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
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `seller_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `toko`
--

INSERT INTO `toko` (`id`, `nama`, `alamat`, `kota`, `deskripsi`, `created_at`, `seller_id`) VALUES
(1, 'Toko Baju Daerah', 'Jl. Ahmad Yani No.45', 'Magelang', NULL, '2026-04-08 15:13:15', 1),
(2, 'Rental Kebaya Modern', 'Jl. Thamrin No.49', 'Magelang', NULL, '2026-04-08 15:13:15', NULL),
(3, 'Batik Heritage Store', 'Jl. Asia Afrika No.78', 'Magelang', NULL, '2026-04-08 15:13:15', NULL),
(4, 'Toko Adat Jaya', 'Jl. Gatot Subroto No.234', 'Magelang', NULL, '2026-04-08 15:13:15', NULL),
(5, 'Sewa Baju Pengantin Adat', 'Jl. Diponegoro No.56', 'Magelang', NULL, '2026-04-08 15:13:15', NULL),
(6, 'Butik Hana', 'Jl. Sudirman No.123', 'Magelang', NULL, '2026-04-08 15:13:15', NULL),
(7, 'toko baju ratna', 'ds sidomukti', 'Kebumen', NULL, '2026-05-07 00:41:47', 8),
(8, 'toko bu tinem', 'magelang mertoyudan', 'Magelang', NULL, '2026-05-07 11:08:25', 21),
(9, 'toko baju retno', 'Ketonggo Desa Sidomukti RT 03 RW 02 Kecamatan Adimulyo Kabupaten Kebumen', 'Kebumen', 'Baju Batik Khas Kebumen', '2026-06-02 10:06:33', 30);

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
  `phone` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` enum('customer','seller') NOT NULL DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `alamat`, `phone`, `created_at`, `updated_at`, `role`) VALUES
(1, 'admin', 'admin@gmail.com', '$2y$10$mBcImXzzYZW06sIXD9V.HuUd6QyPn.S/ijvGM6/F9RdJHeXWZIZb6', 'kebumen', NULL, '2026-04-08 15:16:32', '2026-05-06 19:37:49', 'seller'),
(2, 'faiz', 'faiz@gmail.com', '$2y$10$CteqkB5hvqCK6vg6uaDB7e9y7AtVDI/E60z7sOQCwvKz3LQi8UpVq', 'kebumen,jawa', NULL, '2026-04-08 16:16:31', '2026-04-08 16:47:08', 'customer'),
(3, 'gue', 'gue@gmail.com', '$2y$10$H48ipbj4PUKmFhq/H3WM4OJfWLfq6y7qzb2CPeB2Irx8Nd9j0Ek6C', NULL, NULL, '2026-04-08 19:30:18', '2026-04-08 19:30:18', 'customer'),
(4, 'aku', 'aku@gmail.com', '$2y$10$6oWSQ1ighQZOVvgzeE9L6eie15YjSuAYQHxhxqhjMR9Ap2g2Yh3AC', 'magelang', NULL, '2026-04-09 08:46:44', '2026-04-09 09:41:15', 'customer'),
(5, 'hhhh', 'hhhh@gmail.com', '$2y$10$7JAR0uql0J.0BZb3KoQdaeXSedajQ18LeaNqkDOUCWMXLzdFP8Rgy', NULL, NULL, '2026-04-09 10:46:42', '2026-04-09 10:46:42', 'customer'),
(6, 'admin', 'admintoko@gmail.com', '$2y$10$VkZqdaRLdGfhKV9DGRJppuAASJ4kVz8c7SIsSl4gjOY3w/XnCk6dy', NULL, NULL, '2026-05-06 23:59:09', '2026-05-06 23:59:09', 'customer'),
(7, 'faiz', 'faizjual@gmail.com', '$2y$10$2EYmVqNx4M8O62Hjvsv8jumxkJgnZuT1xaTGC.QKSdbRq./XQHekq', NULL, NULL, '2026-05-07 00:01:25', '2026-05-07 00:01:25', 'customer'),
(8, 'admin', 'adminku@gmail.com', '$2y$10$UQVs5q6TTV1JATrqE3.lGuqDckFQDNfFwkUr8S3b5J8jqBz2TZdO6', NULL, NULL, '2026-05-07 00:16:18', '2026-05-07 00:40:49', 'seller'),
(9, 'faizganteng', 'faizganteng@gmail.com', '$2y$10$pSszVJ3NG0LgibGZjz2NHeMbudcU2dNmXetOAD3kkB.pn6cv//1sS', NULL, NULL, '2026-05-07 00:26:30', '2026-05-07 00:26:30', 'customer'),
(10, 'aku', 'aku1@gmail.com', '$2y$10$Hv01aFzcGx2nZm/JDiOLi.zXZYTuTDD.WOYGVMAPo7IcgBVY4HTHW', NULL, NULL, '2026-05-07 00:31:18', '2026-05-07 00:31:18', 'customer'),
(11, '123', '123@gmail.com', '$2y$10$L3VAdmBPernndDfC4aaZ8ONW29gskohPaHZVEHL3aZoO7O1fXDPhC', NULL, NULL, '2026-05-07 00:33:35', '2026-05-07 00:33:35', 'customer'),
(12, 'pria', 'pria@gmail.com', '$2y$10$ev7aQfDhlwecrdFCsdC.SeOcGAbdjzL5y.DOnInwKkj5CqlBUtAX.', NULL, NULL, '2026-05-07 00:39:13', '2026-05-07 00:39:13', 'customer'),
(13, 'akulaku', 'akulaku@gmail.com', '$2y$10$MYT6llnrLna2ic5KYl0aweUqFwXDklFl6kwnNOhuk.Vk11xPANR7m', NULL, NULL, '2026-05-07 09:46:47', '2026-05-07 09:46:47', 'customer'),
(14, 'ku', 'ku@gmail.com', '$2y$10$8lWC6Ha1JitaWzC2Wn6JWO7asTrvTj9Q6oKWACzBvIR5VawfOzVYC', NULL, NULL, '2026-05-07 09:47:42', '2026-05-07 09:47:42', 'customer'),
(15, 'seller', 'seller@gmail.com', '$2y$10$h.CZzpvgi2Qm/o1lPpbMmehrEVI2l8DXnfhnxdQBGhYwt3PB7hWU2', NULL, NULL, '2026-05-07 10:31:20', '2026-05-07 10:31:20', 'customer'),
(16, 'seller1', 'seller1@gmail.com', '$2y$10$8v3isfb4xWA3J0nX5qU2Jen4VFPQvrMLENqkWJ6VWFsj5fHz01biG', NULL, NULL, '2026-05-07 10:45:42', '2026-05-07 10:45:42', 'customer'),
(17, 'seller2', 'seller2@gmail.com', '$2y$10$fBsJimzHuWCfxVzhybuiHe9KHfmyolByRhigsgC0I1IWc680It5qC', NULL, NULL, '2026-05-07 10:46:37', '2026-05-07 10:46:37', 'customer'),
(18, 'seller3', 'seller3@gmail.com', '$2y$10$w3g6/TTuLhA1Q5pd.vDteOkpKLmTqehjGUHwehhfiAOIhdliFCxIa', NULL, NULL, '2026-05-07 10:54:24', '2026-05-07 10:54:24', 'customer'),
(19, 'Test Seller', 'test_seller_123@gmail.com', '$2y$10$UIKeIi.i/Ot9g7In.cqqluULV4ekaIFZvTghgGZi84zDfNQ2YD1t6', NULL, NULL, '2026-05-07 10:56:54', '2026-05-07 10:56:54', 'seller'),
(20, 'test customer', 'test_seller_1234@gmail.com', '$2y$10$ox0pLxY1d4i4qPKDCzlsfuEJa3wKVHt.kr6MLGsyDD1.4Yy.PvmVi', NULL, NULL, '2026-05-07 11:00:26', '2026-05-07 11:00:26', 'customer'),
(21, 'seller4', 'seller4@gmail.com', '$2y$10$UYAv0VRHoD1rHTYixsf3ueVnvxIAcXqgyMjqexQsAM9kx3M8FdW0C', NULL, NULL, '2026-05-07 11:07:25', '2026-05-07 11:07:25', 'seller'),
(23, 'seller5', 'seller5@gmail.com', '$2y$10$79uQqTBQ/FYwv4yemS0CZe2Sdj56neWpZDc5XidcyWExqFhIL51Ya', NULL, NULL, '2026-05-07 11:19:15', '2026-05-07 11:19:15', 'seller'),
(25, 'seller6', 'seller6@gmail.com', '$2y$10$MPmZNDPMCQSD6MFOL6DIYe8KrfHYTs0TXM4i8Ruie4rQ2Zv6aXdZS', NULL, NULL, '2026-05-07 11:19:58', '2026-05-07 11:19:58', 'customer'),
(27, 'seller7', 'seller7@gmail.com', '$2y$10$YG6XtTc3Ql.QsI4CiLsmoOA2Iu2coxnHBo/09iOP.L05jMXHTYztK', NULL, NULL, '2026-05-07 11:27:08', '2026-05-07 11:27:08', 'seller'),
(29, 'mas faiz', 'mas@gmail.com', '$2y$10$wAy4.GR6GZLcFxVriVVbfuKwiaqJ8zksILrA9200FOwqacymbTwV.', 'kebumen', '', '2026-06-02 09:59:02', '2026-06-02 10:21:51', 'customer'),
(30, 'toko bu retno', 'retno@gmail.com', '$2y$10$PEY6Gpgqou0kdHmOQg/vr.Mrk4atB0dS/p2hZBJ38kMYFEpLhjaa.', 'Ketonggo Desa Sidomukti RT 03 RW 02 Kecamatan Adimulyo Kabupaten Kebumen', '+62 83144667088', '2026-06-02 10:06:33', '2026-06-02 10:06:33', 'seller');

-- --------------------------------------------------------

--
-- Struktur dari tabel `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `produk_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  ADD KEY `idx_toko_kota` (`kota`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- Indeks untuk tabel `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_produk` (`user_id`,`produk_id`),
  ADD KEY `produk_id` (`produk_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `produk`
--
ALTER TABLE `produk`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT untuk tabel `produk_varian`
--
ALTER TABLE `produk_varian`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT untuk tabel `toko`
--
ALTER TABLE `toko`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

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

--
-- Ketidakleluasaan untuk tabel `toko`
--
ALTER TABLE `toko`
  ADD CONSTRAINT `toko_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
