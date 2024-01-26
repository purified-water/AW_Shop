const { as } = require('pg-promise');
const db = require('../utils/db');

module.exports = {
    createDetail: async (order_id, product_id, date, quantity) => {
        try {
            const entity = {
                order_id: order_id,
                product_id: product_id,
                date: date,
                quantity: quantity,
            }

            console.log('Created detail', entity);
            await db.insert('order_detail', entity, 'order_id');
            return entity;
        } catch (error) {
            console.log(error);
        }
    },
    getDetailOrder: async () => {
        try {
            const query = await db.getAll('public.order_detail');
            return query;
        }
        catch(e){
            console.log(e);
        }
    }, 
    
}