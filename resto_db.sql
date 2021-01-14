-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 03 Des 2020 pada 14.49
-- Versi server: 10.4.11-MariaDB
-- Versi PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `resto_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `cityMaster`
--

CREATE TABLE `cityMaster` (
  `id` int(11) NOT NULL,
  `cityName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `cityMaster`
--

INSERT INTO `cityMaster` (`id`, `cityName`) VALUES
(1, 'Jakarta'),
(2, 'Tanggerang'),
(5, 'Makasar'),
(6, 'Jogja');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cuisineMaster`
--

CREATE TABLE `cuisineMaster` (
  `id` int(11) NOT NULL,
  `cuisineType` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `cuisineMaster`
--

INSERT INTO `cuisineMaster` (`id`, `cuisineType`) VALUES
(1, 'Seafood'),
(2, 'Chinese Food');

-- --------------------------------------------------------

--
-- Struktur dari tabel `restaurants`
--

CREATE TABLE `restaurants` (
  `id` varchar(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `cuisineType` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `rating` float NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `restaurants`
--

INSERT INTO `restaurants` (`id`, `name`, `cuisineType`, `city`, `rating`, `isDeleted`) VALUES
('1', 'Ali Martabak', 'makanan daerah', 'jakarta', 4.5, 0),
('2', 'Masakan Ibu Ani', 'seafood', 'tanggerang', 4.3, 0),
('Resto002', 'Jakarta Mali', 'Seafood', 'Jakarta', 3.5, 0),
('Resto004', 'aaaaaa', 'Chinese Food', 'Makasar', 5, 0),
('Resto005', 'ssssssssss', 'Chinese Food', 'Makasar', 4.5, 0),
('Resto006', 'aaaaaaa', 'Chinese Food', 'Makasar', 5, 0);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `cityMaster`
--
ALTER TABLE `cityMaster`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `cuisineMaster`
--
ALTER TABLE `cuisineMaster`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `cityMaster`
--
ALTER TABLE `cityMaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `cuisineMaster`
--
ALTER TABLE `cuisineMaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
