const axios = require('axios');
const db = require('../utils/db');

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