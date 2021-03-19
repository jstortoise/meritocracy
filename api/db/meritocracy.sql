/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100137
 Source Host           : localhost:3306
 Source Schema         : meritocracy

 Target Server Type    : MySQL
 Target Server Version : 100137
 File Encoding         : 65001

 Date: 03/03/2020 17:49:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Badges
-- ----------------------------
DROP TABLE IF EXISTS `Badges`;
CREATE TABLE `Badges`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `badgeType` int(11) NOT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  CONSTRAINT `badges_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for BaseDetails
-- ----------------------------
DROP TABLE IF EXISTS `BaseDetails`;
CREATE TABLE `BaseDetails`  (
  `baseType` int(11) NOT NULL,
  `code` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `value` float NULL DEFAULT 0,
  `unit` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`baseType`, `code`) USING BTREE,
  CONSTRAINT `basedetails_ibfk_1` FOREIGN KEY (`baseType`) REFERENCES `Bases` (`type`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of BaseDetails
-- ----------------------------
INSERT INTO `BaseDetails` VALUES (0, 0, 'Admin', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (0, 1, 'Moderator', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (0, 2, 'Member', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (0, 3, 'User', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (1, 0, 'Legacy', 0, '', 'Legacy Organisation', '2019-10-31 05:55:18', '2019-10-31 08:03:50');
INSERT INTO `BaseDetails` VALUES (1, 1, 'Certified', 1, '', 'Certified Organisation', '2019-10-31 05:55:18', '2019-10-31 18:26:49');
INSERT INTO `BaseDetails` VALUES (1, 2, 'Public', 2, '', 'Public Organisation', '2019-10-31 05:55:18', '2019-10-31 18:26:50');
INSERT INTO `BaseDetails` VALUES (1, 3, 'Private', 3, '', 'Private Organisation', '2019-10-31 08:21:10', '2019-10-31 18:26:51');
INSERT INTO `BaseDetails` VALUES (2, 0, 'Email Verified Badge', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 1, 'Google Acccount Added Badge', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 2, 'Facebook Acccount Added Badge', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 3, 'Twitter Acccount Added Badge', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 4, 'Instagram Acccount Added Badge', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 5, 'Tipped for the first time', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 6, 'Tipped on amount accumulated', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 7, 'Received a Tip more than 100 Tokens', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 8, 'Received 100 Upvotes', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 9, 'Received a Tip first time', 0, '', '', '2019-10-31 05:55:18', '2019-10-31 05:55:18');
INSERT INTO `BaseDetails` VALUES (2, 10, 'Sent a GLX Tip', 0, '', '', '2019-12-18 21:46:54', '2019-12-18 21:50:45');
INSERT INTO `BaseDetails` VALUES (2, 11, 'Sent a ETH Tip', 0, '', '', '2019-12-18 21:46:54', '2019-12-18 21:50:45');
INSERT INTO `BaseDetails` VALUES (2, 12, 'Sent a BTC Tip', 0, '', '', '2019-12-18 21:46:54', '2019-12-18 21:50:45');
INSERT INTO `BaseDetails` VALUES (2, 13, 'Sent a BCH Tip', 0, '', '', '2019-12-18 21:46:54', '2019-12-18 21:50:45');
INSERT INTO `BaseDetails` VALUES (2, 20, 'Received a GLX Tip', 0, '', '', '2019-12-18 21:47:04', '2019-12-18 21:50:49');
INSERT INTO `BaseDetails` VALUES (2, 21, 'Received a ETH Tip', 0, '', '', '2019-12-18 21:47:04', '2019-12-18 21:50:49');
INSERT INTO `BaseDetails` VALUES (2, 22, 'Received a BTC Tip', 0, '', '', '2019-12-18 21:47:04', '2019-12-18 21:50:49');
INSERT INTO `BaseDetails` VALUES (2, 23, 'Received a BCH Tip', 0, '', '', '2019-12-18 21:47:04', '2019-12-18 21:50:49');
INSERT INTO `BaseDetails` VALUES (3, 0, 'Organisation Weight', 0.5, '', '', '2019-10-31 18:29:34', '2019-11-04 04:41:36');
INSERT INTO `BaseDetails` VALUES (3, 1, 'Consistency Increase', 5, '', '', '2019-10-31 18:29:36', '2019-11-04 04:41:39');
INSERT INTO `BaseDetails` VALUES (3, 2, 'Consistency Decrease', 5, '', '', '2019-10-31 18:30:01', '2019-11-04 04:41:41');
INSERT INTO `BaseDetails` VALUES (4, 0, 'Token amount per a tip', 100, '', '', '2019-10-31 18:26:03', '2019-10-31 16:30:16');
INSERT INTO `BaseDetails` VALUES (4, 1, 'Tip amount accumulated', 5, '', '', '2019-10-31 18:26:06', '2019-10-31 16:30:16');

-- ----------------------------
-- Table structure for BaseFields
-- ----------------------------
DROP TABLE IF EXISTS `BaseFields`;
CREATE TABLE `BaseFields`  (
  `baseType` int(11) NOT NULL,
  `fieldId` int(11) NOT NULL,
  `fieldName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fieldFrom` int(11) NULL DEFAULT NULL,
  `fieldTo` int(11) NULL DEFAULT NULL,
  `value` float NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`baseType`, `fieldId`) USING BTREE,
  CONSTRAINT `BaseFields_ibfk_1` FOREIGN KEY (`baseType`) REFERENCES `Bases` (`type`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of BaseFields
-- ----------------------------
INSERT INTO `BaseFields` VALUES (10, 0, 'Under -10000', NULL, -10000, -10000, '2019-06-25 01:00:28', '2019-06-25 01:27:14');
INSERT INTO `BaseFields` VALUES (10, 1, '-10000 : -1000', -10000, -1000, -1000, '2019-06-25 01:00:28', '2019-06-25 01:27:14');
INSERT INTO `BaseFields` VALUES (10, 2, '-1000 : -100', -1000, -100, -100, '2019-06-25 01:00:28', '2019-06-25 01:27:14');
INSERT INTO `BaseFields` VALUES (10, 3, '-100 : 0', -100, 0, 0, '2019-06-25 01:00:28', '2019-06-25 01:27:14');
INSERT INTO `BaseFields` VALUES (10, 4, '0 : 100', 0, 100, 0, '2019-06-25 01:00:28', '2019-06-25 01:27:14');
INSERT INTO `BaseFields` VALUES (10, 5, '100 : 1000', 100, 1000, 100, '2019-06-25 01:00:28', '2019-06-25 01:27:14');
INSERT INTO `BaseFields` VALUES (10, 6, '1000 : 10000', 1000, 10000, 1000, '2019-06-25 01:00:28', '2019-06-25 01:27:14');
INSERT INTO `BaseFields` VALUES (10, 7, 'Over 10000', 10000, NULL, 10000, '2019-06-25 01:00:28', '2019-06-25 01:27:14');
INSERT INTO `BaseFields` VALUES (11, 0, 'Under -10000', NULL, -10000, -10000, '2019-06-25 01:19:43', '2019-06-25 01:28:23');
INSERT INTO `BaseFields` VALUES (11, 1, '-10000 : -1000', -10000, -1000, -1000, '2019-06-25 01:19:43', '2019-06-25 01:28:23');
INSERT INTO `BaseFields` VALUES (11, 2, '-1000 : -100', -1000, -100, -100, '2019-06-25 01:19:43', '2019-06-25 01:28:23');
INSERT INTO `BaseFields` VALUES (11, 3, '-100 : 0', -100, 0, 0, '2019-06-25 01:19:43', '2019-06-25 01:28:23');
INSERT INTO `BaseFields` VALUES (11, 4, '0 : 100', 0, 100, 0, '2019-06-25 01:19:43', '2019-06-25 01:28:23');
INSERT INTO `BaseFields` VALUES (11, 5, '100 : 1000', 100, 1000, 100, '2019-06-25 01:19:43', '2019-06-25 01:28:23');
INSERT INTO `BaseFields` VALUES (11, 6, '1000 : 10000', 1000, 10000, 1000, '2019-06-25 01:19:43', '2019-06-25 01:28:23');
INSERT INTO `BaseFields` VALUES (11, 7, 'Over 10000', 10000, NULL, 10000, '2019-06-25 01:19:43', '2019-06-25 01:28:23');
INSERT INTO `BaseFields` VALUES (12, 0, 'Under -10000', NULL, -10000, 0, '2019-06-25 01:20:36', '2019-06-25 01:28:45');
INSERT INTO `BaseFields` VALUES (12, 1, '-10000 : -1000', -10000, -1000, 0, '2019-06-25 01:20:36', '2019-06-25 01:28:45');
INSERT INTO `BaseFields` VALUES (12, 2, '-1000 : -100', -1000, -100, 0, '2019-06-25 01:20:36', '2019-06-25 01:28:45');
INSERT INTO `BaseFields` VALUES (12, 3, '-100 : 0', -100, 0, 0, '2019-06-25 01:20:36', '2019-06-25 01:28:45');
INSERT INTO `BaseFields` VALUES (12, 4, '0 : 100', 0, 100, 0.2, '2019-06-25 01:20:36', '2019-06-25 01:28:45');
INSERT INTO `BaseFields` VALUES (12, 5, '100 : 1000', 100, 1000, 0.4, '2019-06-25 01:20:36', '2019-06-25 01:28:45');
INSERT INTO `BaseFields` VALUES (12, 6, '1000 : 10000', 1000, 10000, 0.6, '2019-06-25 01:20:36', '2019-06-25 01:28:45');
INSERT INTO `BaseFields` VALUES (12, 7, 'Over 10000', 10000, NULL, 0.8, '2019-06-25 01:20:36', '2019-06-25 01:28:45');
INSERT INTO `BaseFields` VALUES (20, 0, '0 : 20 %', 0, 20, -2, '2019-06-25 01:21:07', '2019-06-25 01:28:59');
INSERT INTO `BaseFields` VALUES (20, 1, '20 : 40 %', 20, 40, -1, '2019-06-25 01:21:07', '2019-06-25 01:28:59');
INSERT INTO `BaseFields` VALUES (20, 2, '40 : 60 %', 40, 60, 0, '2019-06-25 01:21:07', '2019-06-25 01:28:59');
INSERT INTO `BaseFields` VALUES (20, 3, '60 : 80 %', 60, 80, 1, '2019-06-25 01:21:07', '2019-06-25 01:28:59');
INSERT INTO `BaseFields` VALUES (20, 4, '80 : 100 %', 80, 100, 2, '2019-06-25 01:21:07', '2019-06-25 01:28:59');
INSERT INTO `BaseFields` VALUES (21, 0, '0 : 20 %', 0, 20, -2, '2019-06-25 01:21:37', '2019-06-25 01:29:12');
INSERT INTO `BaseFields` VALUES (21, 1, '20 : 40 %', 20, 40, -1, '2019-06-25 01:21:37', '2019-06-25 01:29:12');
INSERT INTO `BaseFields` VALUES (21, 2, '40 : 60 %', 40, 60, 0, '2019-06-25 01:21:37', '2019-06-25 01:29:12');
INSERT INTO `BaseFields` VALUES (21, 3, '60 : 80 %', 60, 80, 1, '2019-06-25 01:21:37', '2019-06-25 01:29:12');
INSERT INTO `BaseFields` VALUES (21, 4, '80 : 100 %', 80, 100, 2, '2019-06-25 01:21:37', '2019-06-25 01:29:12');
INSERT INTO `BaseFields` VALUES (22, 0, '0 : 20 %', 0, 20, -2, '2019-06-25 01:22:08', '2019-06-25 01:29:24');
INSERT INTO `BaseFields` VALUES (22, 1, '20 : 40 %', 20, 40, -1, '2019-06-25 01:22:08', '2019-06-25 01:29:24');
INSERT INTO `BaseFields` VALUES (22, 2, '40 : 60 %', 40, 60, 0, '2019-06-25 01:22:08', '2019-06-25 01:29:24');
INSERT INTO `BaseFields` VALUES (22, 3, '60 : 80 %', 60, 80, 1, '2019-06-25 01:22:08', '2019-06-25 01:29:24');
INSERT INTO `BaseFields` VALUES (22, 4, '80 : 100 %', 80, 100, 2, '2019-06-25 01:22:08', '2019-06-25 01:29:24');

-- ----------------------------
-- Table structure for Bases
-- ----------------------------
DROP TABLE IF EXISTS `Bases`;
CREATE TABLE `Bases`  (
  `type` int(11) NOT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`type`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of Bases
-- ----------------------------
INSERT INTO `Bases` VALUES (0, 'User Type', '2019-10-30 22:07:30', '2019-10-30 22:07:34');
INSERT INTO `Bases` VALUES (1, 'Organisation Type', '2019-10-30 22:07:30', '2019-10-30 22:07:30');
INSERT INTO `Bases` VALUES (2, 'Badge Type', '2019-10-30 22:09:27', '2019-10-31 05:51:49');
INSERT INTO `Bases` VALUES (3, 'Weight & Consistency Increase/Decrease', '2019-10-31 06:01:12', '2019-10-31 07:53:35');
INSERT INTO `Bases` VALUES (4, 'Tip & Token', '2019-10-31 07:43:30', '2019-10-31 07:53:36');
INSERT INTO `Bases` VALUES (10, 'Organisation Merit Point Range', '2019-10-31 07:53:42', '2019-12-04 06:51:47');
INSERT INTO `Bases` VALUES (11, 'Member Merit Point Range', '2019-10-31 07:53:49', '2019-12-04 06:52:01');
INSERT INTO `Bases` VALUES (12, 'Member Merit Point Range for M2M Member Weight', '2019-10-31 07:53:49', '2019-12-04 06:52:40');
INSERT INTO `Bases` VALUES (20, 'User Test Score Range', '2019-10-31 07:53:51', '2019-12-04 07:15:33');
INSERT INTO `Bases` VALUES (21, 'Organisation Score Range', '2019-10-31 07:53:52', '2019-12-04 07:15:35');
INSERT INTO `Bases` VALUES (22, 'M2M Feedback', '2019-10-31 07:53:53', '2019-10-31 08:03:27');

-- ----------------------------
-- Table structure for Clients
-- ----------------------------
DROP TABLE IF EXISTS `Clients`;
CREATE TABLE `Clients`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `secret` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type` tinyint(4) NULL DEFAULT 0,
  `protocol` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'openid-connect',
  `rootUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `enabled` tinyint(1) NULL DEFAULT 1,
  `meritPoint` float NULL DEFAULT 0,
  `oldPoint` float NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `ownerId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `creatorId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `clients_name`(`name`) USING BTREE,
  UNIQUE INDEX `clients_secret`(`secret`) USING BTREE,
  INDEX `ownerId`(`ownerId`) USING BTREE,
  INDEX `creatorId`(`creatorId`) USING BTREE,
  CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `clients_ibfk_2` FOREIGN KEY (`creatorId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for Comments
-- ----------------------------
DROP TABLE IF EXISTS `Comments`;
CREATE TABLE `Comments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rating` float NULL DEFAULT 0,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `clientId` int(11) NULL DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `clientId`(`clientId`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for Emails
-- ----------------------------
DROP TABLE IF EXISTS `Emails`;
CREATE TABLE `Emails`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `isPrimary` tinyint(1) NULL DEFAULT 0,
  `isVerified` tinyint(1) NULL DEFAULT 0,
  `isActive` tinyint(1) NULL DEFAULT 1,
  `isResetPwd` tinyint(1) NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  CONSTRAINT `emails_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of Emails
-- ----------------------------
INSERT INTO `Emails` VALUES (8, 'gabriel.laurentiu@securesystemdesign.io', 1, 1, 1, 0, '2020-02-27 20:03:04', '2020-02-27 20:09:21', 'c665d851-0755-4e82-b6eb-531f2a42f6f7');

-- ----------------------------
-- Table structure for Files
-- ----------------------------
DROP TABLE IF EXISTS `Files`;
CREATE TABLE `Files`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `size` double NULL DEFAULT 0,
  `privateKey` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `publicKey` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for MyClients
-- ----------------------------
DROP TABLE IF EXISTS `MyClients`;
CREATE TABLE `MyClients`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `testScore` float NULL DEFAULT 0,
  `mpRating` float NULL DEFAULT 0,
  `m2mRating` float NULL DEFAULT 0,
  `consistency` float NULL DEFAULT NULL,
  `isCommented` tinyint(1) NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `clientId` int(11) NULL DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `clientId`(`clientId`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  CONSTRAINT `myclients_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `myclients_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for Notifications
-- ----------------------------
DROP TABLE IF EXISTS `Notifications`;
CREATE TABLE `Notifications`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(4) NULL DEFAULT 0,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `isRead` tinyint(1) NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for Options
-- ----------------------------
DROP TABLE IF EXISTS `Options`;
CREATE TABLE `Options`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `field` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `value` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `clientId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `clientId`(`clientId`) USING BTREE,
  CONSTRAINT `options_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of Options
-- ----------------------------
INSERT INTO `Options` VALUES (1, 0, 'btc', '1', '2020-03-03 13:25:13', '2020-03-03 13:35:58', NULL);
INSERT INTO `Options` VALUES (2, 0, 'bch', '0', '2020-03-03 13:25:13', '2020-03-03 13:35:58', NULL);
INSERT INTO `Options` VALUES (3, 0, 'eth', '1', '2020-03-03 13:25:13', '2020-03-03 13:35:58', NULL);
INSERT INTO `Options` VALUES (4, 0, 'glx', '0', '2020-03-03 13:25:13', '2020-03-03 13:35:58', NULL);

-- ----------------------------
-- Table structure for Scores
-- ----------------------------
DROP TABLE IF EXISTS `Scores`;
CREATE TABLE `Scores`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `value` float NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `clientId` int(11) NULL DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `scores_key_user_id_client_id`(`key`, `userId`, `clientId`) USING BTREE,
  INDEX `clientId`(`clientId`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for Socials
-- ----------------------------
DROP TABLE IF EXISTS `Socials`;
CREATE TABLE `Socials`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `socialType` int(11) NULL DEFAULT 0,
  `socialId` char(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `originId` char(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `keycloakId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `emailId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `socials_ibfk_1`(`emailId`) USING BTREE,
  CONSTRAINT `socials_ibfk_1` FOREIGN KEY (`emailId`) REFERENCES `Emails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for Tips
-- ----------------------------
DROP TABLE IF EXISTS `Tips`;
CREATE TABLE `Tips`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipAmount` int(11) NULL DEFAULT 0,
  `tokenAmount` float NULL DEFAULT 0,
  `coinType` int(11) NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `senderId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `receiverId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `senderId`(`senderId`) USING BTREE,
  INDEX `receiverId`(`receiverId`) USING BTREE,
  CONSTRAINT `tips_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tips_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for Transactions
-- ----------------------------
DROP TABLE IF EXISTS `Transactions`;
CREATE TABLE `Transactions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coinType` int(11) NULL DEFAULT 0,
  `txHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `txType` int(11) NULL DEFAULT 0,
  `block` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `from` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `to` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `value` float NOT NULL DEFAULT 0,
  `txFee` float NOT NULL DEFAULT 0,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users`  (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `firstName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `lastName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `role` int(11) NULL DEFAULT 3,
  `mid` char(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `privateKey` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `publicKey` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `mpRating` float NULL DEFAULT 0,
  `m2mRating` float NULL DEFAULT 0,
  `status` int(11) NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `users_id`(`id`) USING BTREE,
  UNIQUE INDEX `users_username`(`username`) USING BTREE,
  UNIQUE INDEX `users_mid`(`mid`) USING BTREE,
  INDEX `users_firstname_lastname`(`firstName`, `lastName`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of Users
-- ----------------------------
INSERT INTO `Users` VALUES ('c665d851-0755-4e82-b6eb-531f2a42f6f7', 'admin', '$2a$10$YzkHwK8QQJcthUwI7kzz5./bKQvhFPZiPVIL59qrrXzNBfzneKoge', 'Alex', 'Beck', 0, 'fa7a632ac2d097cd', '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.5.5\r\nComment: https://openpgpjs.org\r\n\r\nxYYEXlgf0hYJKwYBBAHaRw8BAQdAEdMuHew8l2K92aIPMsJ3wLo54Zb3d5ek\r\nQgLeSqhraqT+CQMIY15Nt53GPG3g3TpLXr8oIexOnjZiwWc48Y7ROSRNYl8d\r\nzdIiIIMHqdCWODu0xskpP9Z9kNcRrQIIVy1gOrz3YckZPvrQUWeqaRNtKZqs\r\nAs0AwncEEBYKAB8FAl5YH9IGCwkHCAMCBBUICgIDFgIBAhkBAhsDAh4BAAoJ\r\nEPp6YyrC0JfNSrMBAP1Vh3vOuGUvCZ1e8PQ7Wi4/XYUYc5iLgf7f5WLIhzKp\r\nAP4gITDdEeUF+ANMUpMpEUEsbaEl1P4tlw7bN72RIZcbCceLBF5YH9ISCisG\r\nAQQBl1UBBQEBB0DQD19tBCGquoMIjuK9WYipd4O8ID4qdWk439Sx1KeEDgMB\r\nCAf+CQMI4zP/MlskKKHgQb0ELXkhVnCXdxPo9Y8ssxRdT9Qe8UiMNoomj1OT\r\nRzFLLdtUY+pFQFAQqUM9Bsy2oWNUu+m9MW1TrAM/JN2RMp/sFNkDwsJhBBgW\r\nCAAJBQJeWB/SAhsMAAoJEPp6YyrC0JfNB+AA/23zxVIFB89bnKLGjGYA+zDx\r\nH16v5WDQ7z3A6lZ2JzIfAP9Y3nLaSwupkKPbEt2EzWVAG2TUY1pqRJsB5PaV\r\n+QZ8DA==\r\n=KcNT\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n', '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.5.5\r\nComment: https://openpgpjs.org\r\n\r\nxjMEXlgf0hYJKwYBBAHaRw8BAQdAEdMuHew8l2K92aIPMsJ3wLo54Zb3d5ek\r\nQgLeSqhraqTNAMJ3BBAWCgAfBQJeWB/SBgsJBwgDAgQVCAoCAxYCAQIZAQIb\r\nAwIeAQAKCRD6emMqwtCXzUqzAQD9VYd7zrhlLwmdXvD0O1ouP12FGHOYi4H+\r\n3+ViyIcyqQD+ICEw3RHlBfgDTFKTKRFBLG2hJdT+LZcO2ze9kSGXGwnOOARe\r\nWB/SEgorBgEEAZdVAQUBAQdA0A9fbQQhqrqDCI7ivVmIqXeDvCA+KnVpON/U\r\nsdSnhA4DAQgHwmEEGBYIAAkFAl5YH9ICGwwACgkQ+npjKsLQl80H4AD/bfPF\r\nUgUHz1ucosaMZgD7MPEfXq/lYNDvPcDqVnYnMh8A/1jectpLC6mQo9sS3YTN\r\nZUAbZNRjWmpEmwHk9pX5BnwM\r\n=1VKD\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n', 0, 0, 1, '2020-02-27 20:00:18', '2020-02-27 20:09:21');

-- ----------------------------
-- Table structure for Votes
-- ----------------------------
DROP TABLE IF EXISTS `Votes`;
CREATE TABLE `Votes`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) NULL DEFAULT NULL,
  `rating` int(11) NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `clientId` int(11) NULL DEFAULT NULL,
  `ownerId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `voterId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `clientId`(`clientId`) USING BTREE,
  INDEX `ownerId`(`ownerId`) USING BTREE,
  INDEX `voterId`(`voterId`) USING BTREE,
  CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`ownerId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `votes_ibfk_3` FOREIGN KEY (`voterId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for Wallets
-- ----------------------------
DROP TABLE IF EXISTS `Wallets`;
CREATE TABLE `Wallets`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coinType` int(11) NULL DEFAULT 0,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `privateKey` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `publicKey` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `balance` float NOT NULL DEFAULT 0,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of Wallets
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
