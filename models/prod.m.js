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

    addProduct: async (brand, name, price, imageLink, description, product_type) => {
        try {
            const entity = {
                brand: brand,
                name: name,
                price: price,
                price_sign: '₫',
                currency: 'VND',
                image_link: imageLink || '/images2/default.jpg',
                description: description,
                rating: null,
                category: null,
                product_type: product_type,
                tag_list: null
            }
            const query = db.insert('products', entity, 'id');
        } catch (error) {
            console.log(error);
        }
    },

    editProduct: async (productID, brand, name, price, image_link, description) => {
        try {
            const entity = {
                brand: brand,
                name: name,
                price: price,
                image_link: image_link || '/images2/default.jpg',
                description: description
            }
            const query = await db.update('products', entity, 'id', productID);
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