-- Database: dbawshop

-- DROP DATABASE IF EXISTS dbawshop;

CREATE DATABASE dbawshop
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    ICU_LOCALE = 'en-US'
    LOCALE_PROVIDER = 'icu'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


    

-- Create table categories
DROP TABLE IF EXISTS categories;
create table categories (
	category_name varchar(255) not null
);
-- Add PK
alter table categories add constraint PK_catename primary key (category_name) with (fillfactor = 80);


-----
-- Create table products
drop table if exists products;
CREATE TABLE products (
    id SERIAL,
    title VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(255) REFERENCES categories(category_name),
    image VARCHAR(255),
    rating_rate NUMERIC(3, 1) NOT NULL,
    rating_count INT NOT NULL
);
-- Add PK
alter table products
add constraint PK_productid primary key (id) with (fillfactor = 80);
-- Add FK
alter table products
add constraint FK_categoryCategoryName foreign key (category) 
references categories(category_name);

----
-- Create table users
drop table if exists users;
CREATE TABLE users (
    id SERIAL,
    role VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    geolocation_lat VARCHAR(20),
    geolocation_long VARCHAR(20),
    city VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    zipcode VARCHAR(20) NOT NULL
);
-- Add PK
alter table users
add constraint PK_userid primary key (id) with (fillfactor=80);


-----
-- Create table cart
drop table if exists cart;
create table cart (
	id SERIAL,
    user_id INT NOT NULL,
    date TIMESTAMPTZ,
    products JSONB NOT NULL
);
-- Add PK
alter table cart add constraint PK_cartid primary key (id) with (fillfactor=80);
-- Add FK
alter table cart add constraint FK_userid foreign key (user_id) references users(id);



