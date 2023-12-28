const db = require('../utils/db');

module.exports = {
    getProductsWithCate: (cateID) => {
        try {
            const prodList = [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
                { id: 3, name: 'Product 3' },
            ];
            return prodList;
        }
        catch(e) {
            console.log(e);
        }
    },
}