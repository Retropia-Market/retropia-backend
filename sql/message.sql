DROP DATABASE IF EXISTS backend_retropia;
CREATE DATABASE IF NOT EXISTS backend_retropia;

USE backend_retropia;
CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(30) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(500) NOT NULL,
    `firstname` VARCHAR(50) DEFAULT NULL,
    `lastname` VARCHAR(50) DEFAULT NULL,
    `location` VARCHAR(100) DEFAULT NULL,  
    `bio` TEXT(500) DEFAULT NULL,
    `image` VARCHAR(100) DEFAULT NULL,
    `banner` VARCHAR(200) DEFAULT NULL,
    `phone_number` VARCHAR(20) DEFAULT NULL,
      `birth_date` DATE DEFAULT NULL,
    `verified` INT DEFAULT 0,
    `email_code` VARCHAR(400) DEFAULT NULL,
    `password_token` VARCHAR(400) DEFAULT NULL,
    `external_user` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
);

CREATE TABLE `products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `seller_id` INT NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `upload_date` DATE NOT NULL,
    `location` VARCHAR(100) NOT NULL,  
    `product_type` VARCHAR(100) NOT NULL,
    `price` VARCHAR(255) NOT NULL,	
    `sale_status` VARCHAR(255) DEFAULT 'disponible',
    `description` TEXT(500) DEFAULT NULL,
    `sale_date` DATE DEFAULT NULL,
    `views` INT DEFAULT 0,
    FOREIGN KEY (seller_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

CREATE TABLE `products_img` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

  CREATE TABLE `reviews` (
    `id` int NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL UNIQUE,
    `review_rating` INT DEFAULT NULL,
    `review_text` TEXT(500) DEFAULT NULL,
    `review_date` DATE DEFAULT NULL,
    `user_id` INT NOT NULL,
    `watched` INT DEFAULT 0,
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);



  CREATE TABLE `bids` (
    `id` int NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `bid_price` INT NOT NULL,
    `edited_bid_price` INT NOT NULL DEFAULT 0,
    `user_id` INT NOT NULL,
    `bid_message` TEXT(500) DEFAULT NULL,
    `edited_bid_message` INT NOT NULL DEFAULT 0,
    `bid_status` VARCHAR(20) NOT NULL DEFAULT 'ofertado',
    `bid_date` DATE NOT NULL,
	 `watched` INT DEFAULT 0,
       `watched_after_accepted` INT DEFAULT 0,
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

CREATE TABLE `favourites` (
    `id` int NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

CREATE TABLE `categories` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `sub_categories` (
    `id` int NOT NULL AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

CREATE TABLE `products_has_subcategory` (    
    `id` int NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `subcategory_id` INT NOT NULL,
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id)
    REFERENCES sub_categories(id)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);



CREATE TABLE `message`(
  `id` int NOT NULL AUTO_INCREMENT,
  `src_id` INT NOT NULL ,
  `dst_id` INT NOT NULL ,
  `message` text not null,
  `date` TIMESTAMP NOT NULL ,
  `status` int not null default 0,
  FOREIGN KEY (src_id)
  REFERENCES users(id)
  ON DELETE CASCADE,
  FOREIGN KEY (dst_id)
  REFERENCES users(id),
  PRIMARY KEY (`id`)
);

CREATE TABLE `contacts`(
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id_1` INT NOT NULL ,
  `user_id_2` INT NOT NULL ,
  FOREIGN KEY (user_id_1)
  REFERENCES users(id)
  ON DELETE CASCADE,
  FOREIGN KEY (user_id_2)
  REFERENCES users(id),
  PRIMARY KEY (`id`)
);

INSERT INTO categories (name) VALUES ('sony'), ('nintendo'), ('microsoft'), ('atari'), ('sega'), ('pc');

INSERT INTO sub_categories (name, category_id) VALUES ('playstation', 1), ('ps vita', 1), ('psp', 1),('playstation 2', 1), ('playstation 3', 1), ('xbox 360', 3), ('xbox one', 3), ('xbox', 3), ('nes', 2), ('game boy', 2), ('game boy color', 2),
 ('game boy advance', 2), ('nintendo switch', 2),('nintendo ds', 2), ('nintendo 3ds', 2), ('wii', 2), ('wii u', 2), ('nintendo dsi', 2) , ('nintendo 64', 2), ('gamecube', 2), ('pc', 6), ('playstation 5', 1), ('playstation 4', 1),('xbox series s/x', 3),
('snes', 2), ('commodore / amiga', 6), ('atari 7800', 4), ('atari 5200', 4), ('atari 2600', 4), ('atari flashback', 4), ('atari 8-bit', 4), ('atari st', 4),
('atari linx', 4), ('atari xegs', 4), ('genesis', 5), ('sega saturn', 5), ('sega cd', 5), ('sega 32x', 5), ('sega master system', 5),  ('dreamcast', 5),
('3do', 1), ('jaguar', 4), ('game gear', 5), ('neo geo', 2), ('apple II', 6);
