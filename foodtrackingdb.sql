-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 06, 2024 at 04:46 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodtrackingdb`
--
CREATE DATABASE IF NOT EXISTS `foodtrackingdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `foodtrackingdb`;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `favoritesId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `foodId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foods`
--

CREATE TABLE `foods` (
  `foodId` int(11) NOT NULL,
  `fdcId` int(55) NOT NULL,
  `food_name` varchar(100) NOT NULL,
  `calories` int(11) NOT NULL,
  `protein` int(11) NOT NULL,
  `carbs` int(11) NOT NULL,
  `fats` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `foods`
--

INSERT INTO `foods` (`foodId`, `fdcId`, `food_name`, `calories`, `protein`, `carbs`, `fats`) VALUES
(1, 0, 'string', 0, 0, 0, 0),
(2, 170736, 'TACO BELL, Taco Salad', 170, 7, 15, 9),
(3, 2342376, 'Whopper (Burger King)', 226, 11, 17, 12),
(6, 170704, 'School Lunch, pizza, TONY\'S Breakfast Pizza Sausage, frozen', 240, 10, 27, 10);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `email`, `password`) VALUES
(1, 'brianbustos', 'brianbustos@email.com', 'brianbustos'),
(2, 'string', 'string', '473287f8298dba7163a897908958f7c0eae733e25d2e027992ea2edc9bed2fa8'),
(3, 'emilyjohn', 'emilyjohn@email.com', 'emilyjohn'),
(4, 'johnsmith', 'johnsmith@email.com', 'johnsmith'),
(5, 'kylesmith', 'kylesmith@email.com', 'kylesmith');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`favoritesId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `foodId` (`foodId`);

--
-- Indexes for table `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`foodId`),
  ADD UNIQUE KEY `fdcId` (`fdcId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `favoritesId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `foods`
--
ALTER TABLE `foods`
  MODIFY `foodId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`foodId`) REFERENCES `foods` (`foodId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
