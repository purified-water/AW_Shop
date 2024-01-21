-- Database: dbawshop

-- DROP DATABASE IF EXISTS dbawshop;

-- CREATE DATABASE dbawshop
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE = 'en_US.UTF-8'
--     ICU_LOCALE = 'en-US'
--     LOCALE_PROVIDER = 'icu'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;

drop table if exists shop_order;
drop table if exists cart_items;
drop table if exists cart;
drop table if exists products;
drop table if exists categories;
drop table if exists account;
drop table if exists users;

-- -- Create table categories
-- DROP TABLE IF EXISTS product_type;
create table categories (
	product_type varchar(255) not null,
    image_link varchar(255)
);
-- Add PK
alter table categories add constraint PK_type primary key (product_type) with (fillfactor = 80);

CREATE TABLE products (
    id SERIAL,
    brand VARCHAR(255),
    name VARCHAR(255),
    price NUMERIC(10, 0),
    price_sign VARCHAR(1),
    currency VARCHAR(5),
    image_link VARCHAR(500),
    description TEXT,
    rating NUMERIC(3, 2),
    category VARCHAR(255),
    product_type VARCHAR(255),
    tag_list VARCHAR(500) ARRAY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
-- Add PK
alter table products
add constraint PK_productid primary key (id) with (fillfactor = 80);
-- -- Add FK
-- alter table products
-- add constraint FK_productTypeName foreign key (product_type) 
-- references product_type(product_type_name);

----
-- Create table users
-- drop table if exists users;
CREATE TABLE users (
    id SERIAL,
    role VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(255),
    street VARCHAR(255),
    zipcode VARCHAR(20)
);
-- Add PK
alter table users
add constraint PK_userid primary key (id) with (fillfactor=80);



-- Table Account
-- drop table if exists account;
create table account (
    user_id INT,
    balance NUMERIC(10, 0) NOT NULL DEFAULT 0
);

-- Add PK
alter table account add constraint PK_accountid primary key (user_id) with (fillfactor=80);
-- Add FK
alter table account add constraint FK_userid foreign key (user_id) references users(id);

-----
-- Create table cart
-- drop table if exists cart;
create table cart (
	id SERIAL,
    user_id INT NOT NULL
);
-- Add PK
alter table cart add constraint PK_cartid primary key (id) with (fillfactor=80);
-- Add FK
alter table cart add constraint FK_userid foreign key (user_id) references users(id);


--- Bang cart_items
create table cart_items (
    id SERIAL,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL
);

-- Add PK
alter table cart_items add constraint PK_cartitemid primary key (id) with (fillfactor=80);
-- Add FK
alter table cart_items add constraint FK_cartid foreign key (cart_id) references cart(id);
alter table cart_items add constraint FK_productid foreign key (product_id) references products(id);


-- Table Order
-- drop table if exists shop_order;
create table shop_order (
    id SERIAL,
    cart_id INT NOT NULL,
    date TIMESTAMPTZ,
    total NUMERIC(10, 0) NOT NULL,
    status VARCHAR(255) NOT NULL
);

-- Add PK
alter table shop_order add constraint PK_orderid primary key (id) with (fillfactor=80);
-- Add FK
alter table shop_order add constraint FK_cartid foreign key (cart_id) references cart(id);