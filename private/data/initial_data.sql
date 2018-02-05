
--
-- Current Database: `test`
--

-- CREATE DATABASE IF NOT EXISTS `test`;

--
-- Table structure for table `Test`
--


DROP TABLE IF EXISTS `Test`;

CREATE TABLE `Test`
(
  `testId` VARCHAR(50) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`testId`)
);

--
-- Dumping data for table `ProviderBalance`
--

INSERT INTO `Test` (testId, createdAt)
  VALUES ('justAMail', CURRENT_TIMESTAMP);
