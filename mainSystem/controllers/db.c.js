const axios = require('axios');
const db = require('../utils/db');
const bcrypt = require('bcrypt')
const fs = require('fs');
const path = require('path');



// Check if the image link returns a 404 error
async function isImageLinkValid(url) {
    // You can use a library like 'axios' to make an HTTP request and check the status code
    // Here's a simplified example using fetch
    return fetch(url)
        .then(response => response.ok)
        .catch(() => false);
}

module.exports = {
    initUsers: async (req, res) => {
        const adminExist = await db.getCondition('users', 'username', 'admin');
        const hashedPassword = await bcrypt.hash('admin', 10);

        if (adminExist.length === 0) {
            const admin = {
                role: 'admin',
                email: 'admin123@gmail.com',
                username: 'admin',
                password: hashedPassword,
                firstname: 'Admin',
                lastname: 'User',
                phone: '0373893504',
                city: 'HCM',
                street: '123',
                zipcode: '123',

            }
            await db.insert('users', admin, 'id');
            
        }
        const adminUser = await db.getCondition('users', 'username', 'admin');
            const account = {
                user_id: parseInt(adminUser[0].id),
                balance: 0
            }
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            const jsonRes = await fetch('https://localhost:8888/account/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ account })
            })
            if (jsonRes.status !== 200) {
                console.log('Error when create account');
                return res.status(500).json({ message: 'Error when create account' });
            }



            // console.log('Admin created!');
    },
    importData: async (req, res) => {
        const sqlScriptPath = path.join(__dirname, '../createTables.sql');
        console.log('Script', sqlScriptPath);
        // Create tables
        const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');
        //  const checkIfCreatedTables = await db.getCategories();
        //  if (checkIfCreatedTables.length === 0) {
        const tempQuery = await db.getWithQuery(sqlScript);
        console.log('Created tables successfully');
        //  }

        // Create admin
        const adminExist = await db.getCondition('users', 'username', 'admin');
        const hashedPassword = await bcrypt.hash('admin', 10);

        if (adminExist.length === 0) {
            const admin = {
                role: 'admin',
                email: 'admin123@gmail.com',
                username: 'admin',
                password: hashedPassword,
                firstname: 'Admin',
                lastname: 'User',
                phone: '0373893504',
                city: 'HCM',
                street: '123',
                zipcode: '123',

            }
            await db.insert('users', admin, 'id');
            console.log('Admin created!');

        }
        const adminUser = await db.getCondition('users', 'username', 'admin');
        const account = {
            user_id: parseInt(adminUser[0].id),
            balance: 0
        }
        

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        console.log('Account admin is', account);
        const jsonRes = await fetch('https://localhost:8888/account/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account })
        })
        const jsonRes2 = await jsonRes.json();
        if (jsonRes.status !== 200) {
            console.log('Error when create account');
            return res.status(500).json({ message: 'Error when create account' });
        } else {
            console.log('Message from account', jsonRes2.message);
        }

        // // Create tables
        // const sqlScript = fs.readFileSync('createTables.sql', 'utf8');
        // const checkIfCreatedTables = await db.getCategories();
        // if (checkIfCreatedTables.length === 0) {
        //     const tempQuery = await db.getWithQuery(sqlScript);
        //     console.log('Created tables successfully');
        // }

        try {
            const limit = 200; // Change this to the desired number of items
            const data = await axios.get('http://makeup-api.herokuapp.com/api/v1/products.json', {
                params: {
                    limit: limit
                }
            });
            const jsonData = data.data;
            // console.log('Data', data);
            // Import data to database
            for (let product of jsonData) {
                let price = parseInt(product.price);
                if (product.brand == 'iman') {
                    continue;
                }
                // Bỏ các product có giá = 0
                if (price == null || isNaN(price) || price <= 0) {
                    // console.log(product.name, 'has price of', price);
                    continue;
                }
                product.price = Math.round(product.price * 23000);
                if (product.price <= 0) {
                    continue;
                }
                product.price_sign = '₫';
                product.currency = 'VND';

                await db.importData(product);
                // import categories
                const cateQuery = await db.getCondition('categories', 'product_type', product.product_type);
                // console.log('cateQuery', cateQuery);
                // Neu chua co category thi insert
                if (cateQuery.length === 0) {

                    await db.insert('categories', { product_type: product.product_type, image_link: `/images2/${product.product_type}.jpg` }, 'product_type');
                    // console.log('imoported category', product.product_type);
                }

            }
            console.log('SUCCESS: Imported all data from api to database');

            // await db.importData(data);
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }
}
