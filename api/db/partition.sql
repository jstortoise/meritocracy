-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT '',
  `firstname` varchar(255) DEFAULT '',
  `lastname` varchar(255) DEFAULT '',
  `role` int(11) DEFAULT '3',
  `private_key` varchar(3000) DEFAULT '',
  `public_key` varchar(3000) DEFAULT '',
  `mid` varchar(255) DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  UNIQUE KEY `users_id_username_email` (`id`,`username`),
  UNIQUE KEY `users_id_username` (`id`,`username`),
  KEY `id` (`id`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50500 PARTITION BY RANGE  COLUMNS(username)
(PARTITION users_0 VALUES LESS THAN ('a') ENGINE = InnoDB,
 PARTITION users_a VALUES LESS THAN ('b') ENGINE = InnoDB,
 PARTITION users_b VALUES LESS THAN ('c') ENGINE = InnoDB,
 PARTITION users_c VALUES LESS THAN ('d') ENGINE = InnoDB,
 PARTITION users_d VALUES LESS THAN ('e') ENGINE = InnoDB,
 PARTITION users_e VALUES LESS THAN ('f') ENGINE = InnoDB,
 PARTITION users_f VALUES LESS THAN ('g') ENGINE = InnoDB,
 PARTITION users_g VALUES LESS THAN ('h') ENGINE = InnoDB,
 PARTITION users_h VALUES LESS THAN ('i') ENGINE = InnoDB,
 PARTITION users_i VALUES LESS THAN ('j') ENGINE = InnoDB,
 PARTITION users_j VALUES LESS THAN ('k') ENGINE = InnoDB,
 PARTITION users_k VALUES LESS THAN ('l') ENGINE = InnoDB,
 PARTITION users_l VALUES LESS THAN ('m') ENGINE = InnoDB,
 PARTITION users_m VALUES LESS THAN ('n') ENGINE = InnoDB,
 PARTITION users_n VALUES LESS THAN ('o') ENGINE = InnoDB,
 PARTITION users_o VALUES LESS THAN ('p') ENGINE = InnoDB,
 PARTITION users_p VALUES LESS THAN ('q') ENGINE = InnoDB,
 PARTITION users_q VALUES LESS THAN ('r') ENGINE = InnoDB,
 PARTITION users_r VALUES LESS THAN ('s') ENGINE = InnoDB,
 PARTITION users_s VALUES LESS THAN ('t') ENGINE = InnoDB,
 PARTITION users_t VALUES LESS THAN ('u') ENGINE = InnoDB,
 PARTITION users_u VALUES LESS THAN ('v') ENGINE = InnoDB,
 PARTITION users_v VALUES LESS THAN ('w') ENGINE = InnoDB,
 PARTITION users_w VALUES LESS THAN ('x') ENGINE = InnoDB,
 PARTITION users_x VALUES LESS THAN ('y') ENGINE = InnoDB,
 PARTITION users_y VALUES LESS THAN ('z') ENGINE = InnoDB,
 PARTITION users_z VALUES LESS THAN (MAXVALUE) ENGINE = InnoDB) */;
