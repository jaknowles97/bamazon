DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

    USE bamazon;

	CREATE TABLE products (
		item_id INT(10) AUTO_INCREMENT NOT NULL,
        product_name VARCHAR(30) NOT NULL,
        department_name VARCHAR(30) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INT(5),
        PRIMARY KEY(item_id)
    ); 

SELECT * FROM products;