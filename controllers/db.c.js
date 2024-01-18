const axios = require('axios');
const db = require('../utils/db');


// Check if the image link returns a 404 error
async function isImageLinkValid(url) {
    // You can use a library like 'axios' to make an HTTP request and check the status code
    // Here's a simplified example using fetch
    return fetch(url)
        .then(response => response.ok)
        .catch(() => false);
}

module.exports = {
    importData: async (req, res) => {
        console.log('Importing');
        try {
            const data = await axios.get('http://makeup-api.herokuapp.com/api/v1/products.json');
            const jsonData = data.data;
            // console.log('Data', data);
            // Import data to database
            for (let product of jsonData) {
                let price = parseFloat(product.price);
                // Bỏ các product có giá = 0
                if (price <= 0.00) {
                    // console.log(product.name, 'has price of', price);
                    continue;
                }
                product.price = Math.round(product.price * 23000);
                product.price_sign = 'đ';
                product.currency = 'VND';
                // // Bỏ các product không có ảnh
                // const isImageLinkValid = await fetch(product.image_link)
                //     .then(response => response.ok)
                //     .catch(() => false);

                // if (isImageLinkValid) {
                //     // Insert the product into the database
                // }                    
                await db.importData(product);


            }
            console.log('SUCCESS: Imported all data from api to database');

            // await db.importData(data);
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }
}