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
    editCate: async (oldCateName, newCateName) => {
        try {
            await db.update('products', newCateName, 'product_type', oldCateName);
        } catch (error) {
            console.log(error);
        }
    },
    deleteCate: async (cateName) => {
        try {
            await db.deleteCondition('products', 'product_type', cateName);
        } catch (error) {
            console.log(error);
        }
    }
}