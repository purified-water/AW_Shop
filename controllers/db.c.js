const axios = require('axios');
const db = require('../utils/db');
const bcrypt = require('bcrypt')


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
            console.log('Admin created!');
        }
    },
    importData: async (req, res) => {
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

        console.log('Importing');
        try {
            const data = await axios.get('http://makeup-api.herokuapp.com/api/v1/products.json');
            const jsonData = data.data;
            // console.log('Data', data);
            // Import data to database
            for (let product of jsonData) {
                let price = parseFloat(product.price);
                // Bỏ các product có giá = 0
                if (price <= 0) {
                    // console.log(product.name, 'has price of', price);
                    continue;
                }
                product.price = Math.round(product.price * 23000);
                product.price_sign = 'đ';
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