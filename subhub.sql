-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: subhub_db
-- ------------------------------------------------------
-- Server version	8.0.19

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
-- Table structure for table `admin_user`
--

DROP TABLE IF EXISTS `admin_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_user` (
  `id` int NOT NULL,
  `name` varchar(245) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_user`
--

LOCK TABLES `admin_user` WRITE;
/*!40000 ALTER TABLE `admin_user` DISABLE KEYS */;
INSERT INTO `admin_user` (`id`, `name`) VALUES (1,'admin(betty)');
/*!40000 ALTER TABLE `admin_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken`
--

DROP TABLE IF EXISTS `authtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `userid` int NOT NULL,
  `startdate` varchar(255) NOT NULL,
  `enddate` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_fk_idx` (`userid`),
  CONSTRAINT `user_fk` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken`
--

LOCK TABLES `authtoken` WRITE;
/*!40000 ALTER TABLE `authtoken` DISABLE KEYS */;
INSERT INTO `authtoken` (`id`, `token`, `userid`, `startdate`, `enddate`) VALUES (8,'aad543b9b68ad941891564c203c17f3e6443a509bab7506ac45b9073f6cfb8d6',1,'2020-05-14 20:36:15','2020-05-15 00:06:44'),(14,'079ec57290228e20499c681ec4bec020cfa4deff198e5ed90f4629fd6a0bc373',1,'2020-05-15 00:04:24','2020-05-15 00:06:44'),(15,'892953a8ced6bdc173353b37d13fe98f65fb8113bc5f6b7e6a09e4e6696e5509',1,'2020-05-15 00:06:44','2020-05-27 00:06:44'),(19,'61476aecf5c5cf296ebb013978d6923c34286c215df2c135c42363e069c58ed4',3,'2020-08-03 16:09:48','2020-08-15 16:09:48'),(20,'61476aecf5c5cf296ebb013978d6923c34286c215df2c135c42363e069c58ed4',3,'2020-08-03 16:09:48','2020-08-15 16:09:48'),(21,'ecf0029c2cf3bd76a521d7690cb89bbab9770a1055973422144cdeec2e89538b',3,'2020-08-03 16:13:23','2020-08-15 16:13:23'),(22,'01305610f683b303e0e88ec6a77ba2b34ce47d798a407b356f858d6144af7aa4',4,'2020-08-04 18:16:33','2020-08-16 18:16:33'),(26,'55566e780c0c7d94a50bdcc0eff1cd3cbfdce39ae062b2a05d66208f6c3542a3',4,'2020-08-06 18:15:13','2020-08-18 18:15:13');
/*!40000 ALTER TABLE `authtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forgotpassword`
--

DROP TABLE IF EXISTS `forgotpassword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forgotpassword` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `code` int NOT NULL,
  `startdate` datetime DEFAULT NULL,
  `enddate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_idx` (`userid`),
  CONSTRAINT `fk_user` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forgotpassword`
--

LOCK TABLES `forgotpassword` WRITE;
/*!40000 ALTER TABLE `forgotpassword` DISABLE KEYS */;
INSERT INTO `forgotpassword` (`id`, `userid`, `code`, `startdate`, `enddate`) VALUES (3,1,30891,'2020-05-14 23:44:42','2020-05-15 00:44:42'),(4,2,42442,'2020-05-15 01:26:53','2020-05-15 02:26:53');
/*!40000 ALTER TABLE `forgotpassword` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subname`
--

DROP TABLE IF EXISTS `subname`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subname` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postby` varchar(255) NOT NULL,
  `subname` varchar(245) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `distance` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `profile` varchar(255) DEFAULT '/userImages/Default.png',
  PRIMARY KEY (`id`),
  KEY `fk_admin_idx` (`postby`),
  CONSTRAINT `fk_admin` FOREIGN KEY (`postby`) REFERENCES `admin_user` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subname`
--

LOCK TABLES `subname` WRITE;
/*!40000 ALTER TABLE `subname` DISABLE KEYS */;
INSERT INTO `subname` (`id`, `postby`, `subname`, `rating`, `distance`, `price`, `profile`) VALUES (1,'admin(betty)','janitor',3,3,200,'/userImages/Default.png'),(2,'admin(betty)','boom operator',4,55,130,'/userImages/Default.png');
/*!40000 ALTER TABLE `subname` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `offset` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `fullname`, `phone`, `email`, `password`, `city`, `offset`) VALUES (1,'muhammad azhar','343243243','m.azhar2455@gmail.com','$2a$08$2ZfPKEqp5W3zE5D6CZpcF.Oup1/HiHxNWL.qTQTTyWEnfkJMjfqcC','pak',-300),(2,'muhammad hamza','34324324343','ham@test.com','$2a$08$fRJl6ndFr6kEqEhX0FJZHu5i9p6oh33YyKfTF9.0gyFXcM2b2lLo2','pak',-300),(3,'azhar coupans test','3433434','az@testing.com','$2a$08$PDPvIwHVGLoeZwdHTWnB5Ojfa9gmcofvGT0c..SOqAbtYm1YnBqD.','wah',NULL),(4,'azhar coupans test','34323434','az1@testing.com','$2a$08$cRLtIPGM.xWaxZtkTcT3j./nvPZkWlkBdj1E2nmYgnadgwm0JnK8e','wah',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-05 22:29:40
