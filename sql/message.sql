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

CREATE TABLE `products_has_subcategory` (    
    `id` int NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `subcategory_id` INT NOT NULL,
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id)
    REFERENCES products(id)
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

INSERT INTO users (firstname, lastname, username, email, password ) VALUES
  ('Alicia', 'Álvarez', 'alialv88', 'alicia@restaurants.com', 'pass1'),
  ('Jorge', 'Romero', 'jorgitox99', 'jorge@restaurants.com', 'pass2'),
  ('Verónica', 'Díaz', 'veronica93','veronica@restaurants.com', 'pass3');
  
INSERT INTO categories (name) VALUES ('Sony'), ('Nintendo'), ('Microsoft'), ('Atari'), ('Sega');

INSERT INTO sub_categories (name, category_id) VALUES ('Play Station 1', 1), ('Xbox', 3), ('Ness', 2);

INSERT INTO products (seller_id, name, status, upload_date, location, price, description) 
	VALUES (1, "play1", "nuevo", "2192-12-31", "KANTO", 34, "super consola"), 
    (1, "Xbox", "nuevo", "1994-12-31", "Huesca", 200,  "Espectacularmente maravilloso"),
    (2, "NES", "Pa tirar", "2122-12-31", "Mozambique", 53, "super consola"),
    (3, "Playstation 6", "Reventao", "2092-12-31", "El Vaticano", 312201, "super bien");
    
INSERT INTO products_has_subcategory (product_id, subcategory_id) VALUES(1, 1), (2, 3), (3, 2), (4, 1);

SELECT products.id, products.seller_id, products.name, products.status, products.price, products.sale_status, 
products.location, products.description, sub_categories.name AS categoria  FROM products  
INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id 
INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  WHERE products.id = 17;
