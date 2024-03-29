require('dotenv').config();
const fs = require('fs');
const { TableName } = require('pg-promise');
// const { as } = require('pg-promise');
const pgp = require('pg-promise')({
    capSQL: true
});

const cn = {
    // Cách 2 (có thể thay đổi các thuộc tính trong file .env)
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW
};
// Sau khi chọn xong thuộc tính trong cn, hãy connect database
const db = pgp(cn);

// Column in products table
const productColumn = [
    'id',
    'brand',
    'name',
    'price',
    'price_sign',
    'currency', 
    'image_link',
    'description',
    'rating', 
    'category',
    'product_type', 
    'created_at', 
    'updated_at'
];


module.exports = {
    getProductCount: async function () {
        try {
            const query = await db.one(
                `SELECT COUNT(*) FROM products`
            );
            const count = parseInt(query.count, 10);
            return count;
        } catch (error) {
            console.log(error);
        }
    },

    getCategories: async function () {
        try {
            const query = await db.any(
                `SELECT DISTINCT product_type FROM categories`
            )
            // console.log('Querying categories: ', query);
            return query;
        } catch (error) {
            console.log(error);
        }
    },

    getAllCategories: async function () {
        try {
            // const query = await db.one('SELECT COUNT(*) FROM (SELECT DISTINCT product_type FROM public.products)');
            const query = await db.one('SELECT COUNT(*) FROM categories');

            return query
        } catch (error) {
            console.log(error);
        }
    },

    getCategoriesByPage: async function(offset, itemsPerPage) {
        try {
            const query = await db.any(
                `SELECT * FROM categories OFFSET $1 LIMIT $2`,
                [offset, itemsPerPage]
            )
            return query;
        } catch (error) {
            console.log(error);
        }
    },

    importData: async function (jsonData) {
        try {
            // gán http cho link ảnh
            const imageLink = jsonData.api_featured_image.startsWith("http:") ? jsonData.api_featured_image : "http:" + jsonData.api_featured_image;
            // get the count of existing products
            const newId = await this.getProductCount() + 1;
            await db.none(`
                INSERT INTO products (
                id, brand, name, price, price_sign, currency, image_link, description,
                rating, category, product_type, tag_list, created_at, updated_at
            )
            VALUES (
                $1, $2, $3, $4::numeric, $5, $6, $7, $8,
                $9::numeric, $10, $11, $12, $13::timestamp, $14::timestamp
            )

            `, [
                newId, jsonData.brand, jsonData.name, jsonData.price, jsonData.price_sign,
                jsonData.currency, imageLink, jsonData.description,
                jsonData.rating, jsonData.category, jsonData.product_type,
                jsonData.tag_list, jsonData.created_at, jsonData.updated_at
            ]);
            // return data
        }
        catch (error) {
            throw error;
        }
        // finally {
        //     if (dbcn != null) {
        //         dbcn.done();
        //     }
        // }
    },
    getAll: async (tbName) => {
        let dbcn = null;
        try {
            const query = `SELECT * FROM ${tbName}`;
            // console.log(query);
            dbcn = await db.connect();
            const data = await dbcn.any(query);

            // console.log(data);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    getCondition: async (tbName, tbColum, value) => {
        let dbcn = null;
        try {
            const query = `SELECT * FROM ${tbName} WHERE ${tbColum}='${value}'`;
            // console.log(query);
            dbcn = await db.connect();

            const data = await dbcn.any(query);

            // console.log(data);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },


    getConditionInTime: async (tbName, tbColum, value, time) => {
        let dbcn = null;
        try {
            var query = "";
            if (time === "month") {
                query = `SELECT * FROM ${tbName} WHERE EXTRACT(MONTH FROM ${tbColum}::timestamp)=EXTRACT(MONTH FROM '${value}'::timestamp) AND EXTRACT(YEAR FROM ${tbColum}::timestamp)=EXTRACT(YEAR FROM '${value}'::timestamp)`;
              } else {
                query = `SELECT * FROM ${tbName} WHERE ${time}(${tbColum})=${time}('${value}')`;
              }
          dbcn = await db.connect();

            const data = await dbcn.any(query);

            // console.log(data);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    getMultiConditions: async (tbName, pairs) => {
        let dbcn = null;
        try {
            // console.log('Conditions', pairs);
            let query = `SELECT * FROM ${tbName} WHERE `;

            for (let i = 0; i < pairs.length; i++) {
                query += `${pairs[i].tbColumn}='${pairs[i].value}'`;
                if (i < pairs.length - 1) {
                    query += ' AND ';
                }
            }

            // console.log(query);
            dbcn = await db.connect();

            const data = await dbcn.any(query);

            // console.log(data);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    deleteCondition: async (tbName, tbColum, value) => {
        let dbcn = null;
        try {
            const query = `DELETE FROM ${tbName} WHERE ${tbColum}='${value}'`;
            // console.log(query);
            dbcn = await db.connect();

            const data = await dbcn.any(query);

            // console.log(data);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    insert: async (tbName, entity, idreturn) => {
        let dbcn = null;
        try {
            const query = pgp.helpers.insert(entity, null, tbName);
            // console.log(query);
            dbcn = await db.connect();
            const data = await dbcn.one(query + ` RETURNING ${idreturn}`);
            return data
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }

    },
    update: async (tbName, entity, tbColumn, value) => {
        let dbcn = null;
        try {
            const query = pgp.helpers.update(entity, null, tbName);
            // console.log(query);
            dbcn = await db.connect();
            const data = await dbcn.oneOrNone(query + ` WHERE ${tbColumn} = '${value}'`);
            return data
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },
    getTop: async (tbName, tbColumn, limit) => {
        let dbcn = null;
        try {
            const query = `SELECT * FROM ${tbName} ORDER BY ${tbColumn} DESC LIMIT ${limit}`;
            // console.log(query);
            dbcn = await db.connect();
            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },
    getWithQuery: async (query) => {
        let dbcn = null;
        try {
            // console.log(query);
            dbcn = await db.connect();
            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },
    countTableWithCondition: async (tbName, tbColumn, value) => {
        let dbcn = null;
        try {
            // console.log(query);
            dbcn = await db.connect();
            const data = await dbcn.any(`SELECT COUNT(*) FROM ${tbName} WHERE ${tbColumn} = '${value}'`);
            const count = parseInt(data[0].count);
            return count;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },
    countTable: async (tbName) => {
        let dbcn = null;
        try {
            // console.log(query);
            dbcn = await db.connect();
            const data = await dbcn.any(`SELECT COUNT(*) FROM ${tbName}`);
            const count = parseInt(data[0].count);
            return count;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },
    getTableWithConditionPerPage: async function(tbName, tbColumn, value, offset, itemsPerPage) {
        try {
            const query = await db.any(
                `SELECT * FROM ${tbName} WHERE ${tbColumn} = '${value}' ORDER BY id OFFSET $1 LIMIT $2;`,
                [offset, itemsPerPage]
            )
            return query;
        } catch (error) {
            console.log(error);
        }
    }

};
