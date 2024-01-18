const db = require('../utils/db');

module.exports = {
    getProductsWithCate: (product_type) => {
        try {
            const query = db.getCondition('products', 'product_type', product_type);
            return query;
        }
        catch(e) {
            console.log(e);
        }
    },
    getProductDetail: (productID) => {
        try {
            const query = db.getCondition('products', 'id', productID);
            return query;
        }
        catch(e) {
            console.log(e);
        }
    },

    addProduct: async (brand, name, price, imageLink, description, category, product_type, tag_list) => {
        try {
            const entity = {
                brand: brand,
                name: name,
                price: price,
                price_sign: '$',
                currency: 'CAD',
                image_link: imageLink || 'https://dummyimage.com/600x400/000/fff',
                description: description,
                rating: null,
                category: category,
                product_type: product_type,
                tag_list: tag_list
            }
            const query = db.insert('products', entity, 'id');
        } catch (error) {
            console.log(error);
        }
    },

    editProduct: async (productID, edittedProduct) => {
        try {
            const query = await db.update('products', edittedProduct, 'id', productID);
        }
        catch(e) {
            console.log(e);
        }
    },

    deleteProduct: async (productID) => {
        try {
            const query = await db.deleteCondition('products', 'id', productID);
        } catch (error) {
            console.log(error);
        }
    }


}