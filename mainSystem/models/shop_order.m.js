const { as } = require('pg-promise');
const db = require('../utils/db');

module.exports = {
    donothing: () => {
        try {
            console.log('hehe');
        }
        catch (e) {
            throw e;
        }
    },
    getShopOrder: async () => {
        try {
            const query = await db.getAll('public.shop_order');
            return query;
        }
        catch(e){
            console.log(e);
        }
    }, 
    getRevenueDay: async () => {
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            console.log('Today:', formattedDate);
            // Assuming db.getCondition is a function that takes a table name, column, and value
            const query = await db.getConditionInTime('public.shop_order', 'date', formattedDate, 'date');
            // console.log(query);
            const totalRevDay = query.reduce((acc, row) => acc + parseInt(row.total, 10), 0);

            return { totalRevDay, query };
        } catch (e) {
            console.log(e);
        }
    },
    getRevenueMonth: async () => {
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            // Assuming db.getCondition is a function that takes a table name, column, and value
            const query = await db.getConditionInTime('public.shop_order', 'date', formattedDate, 'month');
            // console.log(query);
            const totalRevMonth = query.reduce((acc, row) => acc + parseInt(row.total, 10), 0);
            
            return { totalRevMonth, query };
        } catch (e) {
            console.log(e);
        }
    },
    createOrder: async (order_id, user_id, cart_id, total, date, note, method) => {
        

        try {
            const entity = {
                id: order_id,
                cart_id: cart_id,
                user_id: user_id,
                note: note,
                date: date,
                method: method,
                total: total,
                status: 'Processing'
            }

            console.log('Created order', entity);
            await db.insert('shop_order', entity, 'id');
            return entity;
        } catch (error) {
            console.log(error);
        }
    },

    updateOrderStatus: async (order_id, status) => {
        try {
            const entity = {
                status: status
            }
            const pairs = [
                {
                    tbColumn: 'id',
                    value: order_id
                },
                
                {
                    tbColumn: 'status',
                    value: 'Processing'
                }
            ]
            await db.updateMultiConditions('shop_order', entity, pairs);
            return entity;
        } catch (error) {
            console.log(error);
        }
    },
    
}