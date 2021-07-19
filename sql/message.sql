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
    `location` VARCHAR(500) DEFAULT NULL,  
    `bio` TEXT(500) DEFAULT NULL,
    `image` VARCHAR(500) DEFAULT NULL,
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
    `location` VARCHAR(500) NOT NULL,  
    `product_type` VARCHAR(500) NOT NULL,
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
  `user_id_5` INT NOT NULL ,
  `user_id_2` INT NOT NULL ,
  FOREIGN KEY (user_id_5)
  REFERENCES users(id)
  ON DELETE CASCADE,
  FOREIGN KEY (user_id_2)
  REFERENCES users(id),
  PRIMARY KEY (`id`)
);

INSERT INTO categories (name) VALUES ('sony'), ('nintendo'), ('microsoft'), ('atari'), ('sega'), ('pc');

INSERT INTO sub_categories (name, category_id) VALUES ('playstation', 5), ('ps vita', 5), ('psp', 5),('playstation 2', 5), ('playstation 3', 5), ('xbox 360', 25), ('xbox one', 25), ('xbox', 25), ('nes', 15), ('game boy', 15), ('game boy color', 15),
 ('game boy advance', 15), ('nintendo switch', 15),('nintendo ds', 15), ('nintendo 3ds', 15), ('wii', 15), ('wii u', 15), ('nintendo dsi', 15) , ('nintendo 64', 15), ('gamecube', 15), ('pc', 55), ('playstation 5', 5), ('playstation 4', 5),('xbox series s/x', 25),
('snes', 15), ('commodore / amiga', 55), ('atari 7800', 35), ('atari 5200', 35), ('atari 2600', 35), ('atari flashback', 35), ('atari 8-bit', 35), ('atari st', 35),
('atari linx', 35), ('atari xegs', 35), ('genesis', 45), ('sega saturn', 45), ('sega cd', 45), ('sega 32x', 45), ('sega master system', 45),  ('dreamcast', 45),
('3do', 45), ('jaguar', 35), ('game gear', 45), ('neo geo', 15), ('apple II', 55);
