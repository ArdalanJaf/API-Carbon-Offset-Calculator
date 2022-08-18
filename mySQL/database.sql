-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 18, 2022 at 04:28 PM
-- Server version: 10.3.35-MariaDB-cll-lve
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ardalanj_portfolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `offset_simulator_config`
--

CREATE TABLE `offset_simulator_config` (
  `id` varchar(100) CHARACTER SET utf8mb4 NOT NULL COMMENT 'Randomly generated id from back-end. Default config id = "default"',
  `initial_cost` varchar(10) CHARACTER SET utf16 NOT NULL DEFAULT '120' COMMENT 'Initial cost of tree, in dollars (000.00)',
  `upkeep_cost` varchar(10) CHARACTER SET utf8mb4 NOT NULL DEFAULT '12' COMMENT 'Monthly upkeep cost for single tree in dollars (000.00)',
  `annual_offset` varchar(10) CHARACTER SET utf8mb4 NOT NULL DEFAULT '28.5' COMMENT 'Amount of carbon offset by fully grown tree, in kg (00.00)',
  `years_to_grow` varchar(10) CHARACTER SET utf8mb4 NOT NULL DEFAULT '5' COMMENT 'Number of years for tree to become fully grown (0)',
  `date_added` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `offset_simulator_config`
--

INSERT INTO `offset_simulator_config` (`id`, `initial_cost`, `upkeep_cost`, `annual_offset`, `years_to_grow`, `date_added`) VALUES
('default', '120', '12', '28.5', '5', '2022-08-17 11:20:43'),
('config', '120', '12', '28.5', '5', '2022-08-17 11:35:59');

--
-- Indexes for dumped tables
--


--
-- Indexes for table `offset_simulator_config`
--
ALTER TABLE `offset_simulator_config`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
---

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
