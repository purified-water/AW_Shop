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
    
}