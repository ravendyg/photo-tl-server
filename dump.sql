CREATE TABLE `users` (
  `id` bigint(10) not NULL AUTO_INCREMENT,
  `uid` char(64) NOT NULL,
  `name` varchar(60) DEFAULT NULL,
  `password` char(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`name`),
  UNIQUE KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `sessions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cookie` varchar(255) DEFAULT NULL,
  `user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY (`user`),
  CONSTRAINT FOREIGN KEY (`user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `images` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `iid` char(64) NOT NULL,
  `ext` char(5) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `uploaded_by` bigint(20) DEFAULT NULL,
  `uploaded` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `changed` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `views` bigint(10) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`iid`),
  KEY  (`uploaded_by`),
  CONSTRAINT FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `comments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cid` char(64) NOT NULL,
  `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `text` varchar(255) NOT NULL,
  `image` bigint(20) NOT NULL,
  `user` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY  (`cid`),
  KEY (`image`),
  KEY (`user`),
  CONSTRAINT FOREIGN KEY (`user`) REFERENCES `users` (`id`),
  CONSTRAINT FOREIGN KEY (`image`) REFERENCES `images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `ratings` (
  `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `value` int(10) DEFAULT 0,
  `image` bigint(20) NOT NULL,
  `user` bigint(20) NOT NULL,
  PRIMARY KEY (`image`, `user`),
  CONSTRAINT FOREIGN KEY (`user`) REFERENCES `users` (`id`),
  CONSTRAINT FOREIGN KEY (`image`) REFERENCES `images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `views` (
  `image` bigint(20) NOT NULL,
  `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `user` bigint(20) NOT NULL,
  PRIMARY KEY (`image`, `user`),
  CONSTRAINT FOREIGN KEY (`user`) REFERENCES `users` (`id`),
  CONSTRAINT FOREIGN KEY (`image`) REFERENCES `images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
