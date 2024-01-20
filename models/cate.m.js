const db = require('../utils/db');

module.exports = {
    getCates: () => {
        try {
            cateList = db.getCategories();
            // const cateList = await db.getAll('Category');
            return cateList;
        }
        catch(e) {
            console.log(e);
        }
    },
    addCate: async (product_type, image_link) => {
        try {

            const entity = {
                product_type: product_type,
                image_link: image_link || '/images2/default.jpg'
            }
            await db.insert('categories', entity, 'product_type');
        } catch (error) {
            console.log(error);
        }
    },
    editCate: async (oldCateName, newCateName) => {
        try {
            const entity = {
                product_type: newCateName
            }
            console.log('Entity to edit', entity);
            await db.update('categories', {product_type: newCateName}, 'product_type', oldCateName);
            await db.update('products', entity, 'product_type', oldCateName);
        } catch (error) {
            console.log(error);
        }
    },
    deleteCate: async (cateName) => {
        try {
            await db.deleteCondition('products', 'product_type', cateName);
            await db.deleteCondition('categories', 'product_type', cateName);

        } catch (error) {
            console.log(error);
        }
    }
}