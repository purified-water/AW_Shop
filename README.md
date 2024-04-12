# AW Shop Web Application
An e-commerce web application for skincare products using MVC architecture, facilitating sales management and product purchases.
## Preview
![awshop_showcase](https://github.com/purified-water/AW_Shop/assets/115447614/e166bcb2-74ea-4b1a-83bf-dd06ab858371)

## Features
### Admin
- CRUD for products, catergories, users.
- Dashboard for data visualization regarding products sales, user payment and more.
### Client
- Signing in with Google or Facebook account.
- View and select desired products.
- Cart functions.
- Wallet top-up and payment with wallet.
- **_Wallet top-up and payment with VNPay_**
## Installation
- After you have forked the project, you will need to create a database in **Postgres** with the specification in **createTable.sql** file.
- Furthermore, you'd also need to create a **.env** file for the keys and hash secrets. You can look for it.
- Make sure that the database's name and password are matching in the **db.js** file
- For the package installation, at the root folder, do:
  ```
  npm install
  ```
- Now go to the **PaymentSystem** folder and do the same as above using:
  ```Shell
  cd PaymentSystem
  npm install
  ```
**Congrats, the application is almost ready to use!!**

## Running the application
Because we implemented VNPay API in our project, you would have to go to two different folders to run the application (No because we are lazy to update the path)
- At the root directory, run:
  ```
  npm start
  ```
- Then go to **PaymentSystem** and run:
  ```
  npm start
  ```
- Now for the data to be fetched, go to route: https://localhost:3000/getAll and wait for a few seconds

**Hurray, the application is ready!!**

## Special thanks to
- **Trần Đình Nhật Trí** for aiding us in the development phase.
- **makeup-api.herokuapp.com** for the valuable data.
- **Nandita Kadam** for the beautiful CSS preset.

  


