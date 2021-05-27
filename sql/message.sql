DROP DATABASE IF EXISTS backend_retropia;
CREATE DATABASE IF NOT EXISTS backend_retropia;

USE backend_retropia;
CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(30) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(500) NOT NULL,
    `firstname` VARCHAR(50) NOT NULL,
    `lastname` VARCHAR(50) NOT NULL,
    `location` VARCHAR(100) DEFAULT NULL,  
    `bio` TEXT(500) DEFAULT NULL,
    `image` VARCHAR(100) DEFAULT NULL,
    `phone_number` VARCHAR(20) DEFAULT NULL,
    `birth_date` DATE DEFAULT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `seller_id` INT NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `upload_date` DATE NOT NULL,
    `location` VARCHAR(100) NOT NULL,  
    `price` VARCHAR(255) NOT NULL,
    `sale_status` VARCHAR(255) DEFAULT 'disponible',
    `description` TEXT(500) DEFAULT NULL,
    `sale_date` DATE DEFAULT NULL,
    `review_rating` INT DEFAULT NULL,
    `review_text` TEXT(500) DEFAULT NULL,
    `review_date` DATE DEFAULT NULL,
    `views` INT DEFAULT 0,
    FOREIGN KEY (seller_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

CREATE TABLE `products_img` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `url` VARCHAR(100) NOT NULL,
    FOREIGN KEY (product_id)
    REFERENCES products(id)
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
  
INSERT INTO categories (name) VALUES ('Sony'), ('Nintendo'), ('Microsoft'), ('Atari'), ('Sega');

INSERT INTO sub_categories (name, category_id) VALUES ('PlayStation 1', 1), ('PlayStation 2', 1), ('PlayStation 3', 1), ('Xbox 360', 3), ('Xbox One', 3), ('Xbox', 3), ('NES', 2), ('Gameboy Pocket', 2), ('Gameboy Color', 2),
 ('Gameboy Advance', 2), ('DS', 2), ('DS Lite', 2) , ('Nintendo 64', 2), ('Gamecube', 2);
