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
            const query = await db.getCondition('public.shop_order','date',str(datetime.date.today()));
            const totalRevDay = query.reduce((acc,row) => acc + row.total, 0);

            return {totalRevDay, query};
        }
        catch(e){
            console.log(e);
        }
    },
    getRevenueMonth: async () => {
        try {
            const query = await db.getCondition('public.shop_order','date',str(datetime.month.today()));
            const totalRevMonth = query.reduce((acc,row) => acc + row.total, 0);

            return {totalRevMonth, query};
        }
        catch(e){
            console.log(e);
        }
    },
    
}