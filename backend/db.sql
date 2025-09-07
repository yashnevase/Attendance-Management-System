CREATE DATABASE  IF NOT EXISTS `attendance_management_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `attendance_management_system`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: attendance_management_system
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `check_in` datetime DEFAULT NULL,
  `check_out` datetime DEFAULT NULL,
  `total_hours` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,3,'2025-09-06 13:47:40','2025-09-06 19:10:27',5.38,'2025-09-06 08:17:40','2025-09-06 13:40:27'),(2,4,'2025-09-06 19:36:48','2025-09-06 19:37:07',0.01,'2025-09-06 14:06:48','2025-09-06 14:07:07'),(3,5,'2025-09-06 00:03:54','2025-09-06 00:04:54',4.00,'2025-09-06 18:33:54','2025-09-06 18:55:55'),(4,3,'2025-07-08 09:05:00','2025-07-08 17:30:00',8.42,'2025-07-08 03:35:00','2025-07-08 12:00:00'),(5,3,'2025-07-09 09:15:00','2025-07-09 17:40:00',8.42,'2025-07-09 03:45:00','2025-07-09 12:10:00'),(6,3,'2025-07-10 09:00:00','2025-07-10 17:15:00',8.25,'2025-07-10 03:30:00','2025-07-10 11:45:00'),(7,3,'2025-07-11 09:20:00','2025-07-11 17:50:00',8.50,'2025-07-11 03:50:00','2025-07-11 12:20:00'),(8,3,'2025-07-14 09:00:00','2025-07-14 17:00:00',8.00,'2025-07-14 03:30:00','2025-07-14 11:30:00'),(9,3,'2025-07-15 08:55:00','2025-07-15 17:20:00',8.42,'2025-07-15 03:25:00','2025-07-15 11:50:00'),(10,3,'2025-07-16 09:10:00','2025-07-16 17:30:00',8.33,'2025-07-16 03:40:00','2025-07-16 12:00:00'),(11,3,'2025-07-17 09:00:00','2025-07-17 17:10:00',8.17,'2025-07-17 03:30:00','2025-07-17 11:40:00'),(12,3,'2025-07-18 09:05:00','2025-07-18 17:35:00',8.50,'2025-07-18 03:35:00','2025-07-18 12:05:00'),(13,3,'2025-07-21 09:00:00','2025-07-21 17:25:00',8.42,'2025-07-21 03:30:00','2025-07-21 11:55:00'),(14,3,'2025-07-22 09:30:00','2025-07-22 18:00:00',8.50,'2025-07-22 04:00:00','2025-07-22 12:30:00'),(15,3,'2025-07-23 09:15:00','2025-07-23 17:45:00',8.50,'2025-07-23 03:45:00','2025-07-23 12:15:00'),(16,3,'2025-07-24 09:00:00','2025-07-24 17:00:00',8.00,'2025-07-24 03:30:00','2025-07-24 11:30:00'),(17,3,'2025-07-25 09:05:00','2025-07-25 17:10:00',8.08,'2025-07-25 03:35:00','2025-07-25 11:40:00'),(18,3,'2025-07-28 09:00:00','2025-07-28 17:20:00',8.33,'2025-07-28 03:30:00','2025-07-28 11:50:00'),(19,3,'2025-07-29 08:50:00','2025-07-29 17:00:00',8.17,'2025-07-29 03:20:00','2025-07-29 11:30:00'),(20,3,'2025-07-30 09:10:00','2025-07-30 17:40:00',8.50,'2025-07-30 03:40:00','2025-07-30 12:10:00'),(21,3,'2025-07-31 09:20:00','2025-07-31 17:45:00',8.42,'2025-07-31 03:50:00','2025-07-31 12:15:00'),(22,3,'2025-08-01 09:00:00','2025-08-01 17:30:00',8.50,'2025-08-01 03:30:00','2025-08-01 12:00:00'),(23,3,'2025-08-04 09:00:00','2025-08-04 17:30:00',8.50,'2025-08-04 03:30:00','2025-08-04 12:00:00'),(24,3,'2025-09-07 13:39:13',NULL,0.00,'2025-09-07 08:09:13','2025-09-07 08:09:13'),(25,5,'2025-09-07 21:05:58','2025-09-07 21:08:50',0.05,'2025-09-07 15:35:58','2025-09-07 15:38:50');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `leave_type_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `manager_comment` text,
  `admin_override` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `leave_type_id` (`leave_type_id`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
INSERT INTO `leave_requests` VALUES (1,3,1,'2025-09-09','2025-09-09','no re','approved','dsf',0,'2025-09-06 13:41:25','2025-09-06 14:49:37'),(2,4,1,'2025-09-07','2025-09-07','nn','approved','bvbv',1,'2025-09-06 14:07:32','2025-09-06 17:59:54'),(3,3,3,'2025-10-01','2025-10-05','dfgfgdfgdfgdfgdfgdfgdf gdfg df gf','approved',NULL,1,'2025-09-06 17:17:08','2025-09-07 15:33:29'),(4,5,1,'2025-09-08','2025-09-10','sfsdfsdfsdf','approved','hjkghjkgbhjkghjghjgjkhfgjkhjkghjfghjvghjk',1,'2025-09-06 18:34:38','2025-09-07 15:33:49'),(5,5,2,'2025-09-18','2025-09-20','dfdsfsd','rejected','no',0,'2025-09-07 15:35:00','2025-09-07 15:52:44');
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_types`
--

DROP TABLE IF EXISTS `leave_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_types`
--

LOCK TABLES `leave_types` WRITE;
/*!40000 ALTER TABLE `leave_types` DISABLE KEYS */;
INSERT INTO `leave_types` VALUES (1,'Sick Leave'),(2,'Other'),(3,'Personal');
/*!40000 ALTER TABLE `leave_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin'),(3,'Employee'),(2,'Manager');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(55) NOT NULL,
  `username` varchar(55) NOT NULL,
  `email` varchar(455) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin',NULL,'$2b$10$BsX8fjKOGUel4otd5OzzweOZrLZg/mXADhxSQo1sj2UWfa.1h4Npq',1,'2025-09-05 20:23:57'),(2,'manager 1','manager1',NULL,'$2b$10$LzUAfiQJGBsoo6CkJDuSwu9Ro.u0ouNyKg/Yh4Ke4RlHJnFObVFva',2,'2025-09-06 07:51:46'),(3,'employee 1','employee1',NULL,'$2b$10$Gp1Kgi.Am7SU0OGjqFguJu0uuZ/ULmrxmypxbOheINKQeo8fnco0u',3,'2025-09-06 07:52:02'),(4,'employee 2','employee2',NULL,'$2b$10$jygFrmeELK2UGiic6vJCOeoT3sQJLfIOZt4iMX0b4R5R/JJs2RCGu',3,'2025-09-06 13:45:03'),(5,'amit','amit','alanwalkerdj27@gmail.com','$2b$10$0Fxseijit14dI3FFMKYRkufbtV54NFIXYs2m1j2TQswSsbs0VGT.m',3,'2025-09-06 17:53:50'),(6,'teste','teste','alanwalkerdj27@gmail.com','$2b$10$hiQcOSbTC00Jqw1rjXXGQ.VEmzTvvVF.dwWmF/p9HAcVJ6qbHwxwi',3,'2025-09-07 15:53:30'),(7,'testm','testm','alanwalkerdj27@gmail.com','$2b$10$f87ZtD.KaXxD8JB5ReJf7uX8iA4yvozx.43bP.C9RcQYvHHnkQp.6',2,'2025-09-07 15:53:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-07 21:24:36
