const db = require('../utils/db');

async function getProductCount() {
    try {
        const query = `SELECT MAX(id) AS count FROM products`;
        const data = await db.getWithQuery(query);
        return data[0].count;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getProductsWithCatePerPage: async (product_type, offset, itemsPerpage) => {
        try {
            const data = await db.getTableWithConditionPerPage('products','product_type', product_type, offset, itemsPerpage);
            // console.log('count', count);
            return data;
        }
        catch(e) {
            console.log(e);
        }
    },
    countProductsWithTcate: async (product_type) => {
        try {
            const count = await db.countTableWithCondition('products','product_type', product_type);
            // console.log('count', count);
            return count;
        }
        catch(e) {
            console.log(e);
        }
    },
    getProductsWithCate: (product_type) => {
        try {
            const query = db.getCondition('products', 'product_type', product_type);
            return query;
        }
        catch (e) {
            console.log(e);
        }
    },
    getProductDetail: (productID) => {
        try {
            const query = db.getCondition('products', 'id', productID);
            return query;
        }
        catch (e) {
            console.log(e);
        }
    },



    addProduct: async (brand, name, price, imageLink, description, product_type) => {
        const newID = await getProductCount() + 1;
        try {
            const entity = {
                id: newID,
                brand: brand,
                name: name,
                price: price,
                price_sign: 'đ',
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
        catch (e) {
            console.log(e);
        }
    },

    deleteProduct: async (productID) => {
        try {
            const query = await db.deleteCondition('products', 'id', productID);
        } catch (error) {
            console.log(error);
        }
    },

    getTop5Products: async () => {
        try {
            const query = `
            SELECT id, price, image_link, name
            FROM products
            ORDER BY price DESC
            LIMIT 5

            `
            const data = await db.getWithQuery(query);
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    getDeal: async () => {
        try {
            const query = `
            SELECT *
            FROM products
            ORDER BY RANDOM()
            LIMIT 1

            `
            const data = await db.getWithQuery(query);
            // console.log('Deal', data);
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    filter: async (product_type, filter) => {
        let query;
        try {
            switch (filter) {
                case 'A_Z':
                    query = `
                    SELECT *
                    FROM products
                    WHERE product_type = '${product_type}'
                    ORDER BY name ASC
                    `
                    break;
                case 'Z_A':
                    query = `
                    SELECT *
                    FROM products
                    WHERE product_type = '${product_type}'
                    ORDER BY name DESC
                    `
                    break;
                case 'Price_low_to_high':
                    query = `
                    SELECT *
                    FROM products
                    WHERE product_type = '${product_type}'
                    ORDER BY price ASC
                    `
                    break;
                case 'Price_high_to_low':
                    query = `
                    SELECT *
                    FROM products
                    WHERE product_type = '${product_type}'
                    ORDER BY price DESC
                    `
                    break;
            }
            const data = await db.getWithQuery(query);
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    search: async (search) => {
        try {
            const query = `
            SELECT *
            FROM products
            `
            const queryData = await db.getWithQuery(query)
            // Lọc tên sản phẩm có chứa chuỗi tìm kiếm
            const data = queryData.filter((item) => {
                return item.name.toLowerCase().includes(search.toLowerCase())
            }).slice(0, 12); // Get the first 10 items

            return data;
        } catch (error) {
            console.log(error);
        }
    },

    getSimilarProducts: async (product_type) => {
        try {
            const query = `
            SELECT *
            FROM products
            WHERE product_type = '${product_type}'
            ORDER BY RANDOM()
            LIMIT 6
            `
            const data = await db.getWithQuery(query);
            return data;
        } catch (error) {
            console.log(error);
        }

    },

    getTop5BestSeller: async () => {
        try {
            const query = `
            SELECT sum(total) as total, 
            FROM shop_order
            ORDER BY RANDOM()
            LIMIT 5
            `
            const data = await db.getWithQuery(query);
            return data;
        } catch (error) {
            console.log(error);
        }
    }




}