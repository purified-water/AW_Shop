const db = require('../utils/db');

module.exports = {
    getProductsWithCate: (product_type) => {
        try {
            const query = db.getCondition('public.products', 'product_type', product_type);
            return query;
        }
        catch(e) {
            console.log(e);
        }
    },

}