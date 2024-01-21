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
    editCate: async (oldCateName, newCateName, imageLink) => {
        try {
            const entity = {
                product_type: newCateName
            }
            console.log('Entity to edit', entity);
            await db.update('categories', {product_type: newCateName, image_link: imageLink}, 'product_type', oldCateName);
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
    },
    getTop5Categories: async () => {
        try {
            const query = `select ct.product_type, sum(price) as total, ct.image_link
            from products pd JOIN categories ct on pd.product_type = ct.product_type
            group by ct.product_type
            order by sum(price) DESC
            limit 5`
            const data = await db.getWithQuery(query);
            return data;
        } catch (error) {
            console.log(error);
        }
    },

    countCate: async() => {
        try {
            const count = await db.countTable('categories');
            // console.log(count);
            return count;
        } catch (error) {
            console.log(error);
        }
    },
    search: async(search) => {
        try {
            const query = `
            SELECT *
            FROM categories
            `
            const queryData = await db.getWithQuery(query)
            // Lọc tên sản phẩm có chứa chuỗi tìm kiếm
            const data = queryData.filter((item) => {
                return item.product_type.toLowerCase().includes(search.toLowerCase())
            })
            
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}