const shop_order = require('../models/shop_order.m')
const jsonUtils = require('../utils/json');
const db = require('../utils/db');
module.exports = {
    loadAnalyze: async (req,res,next) => {
        try {       
            const orderDay = await shop_order.getRevenueDay();
            const orderMonth = await shop_order.getRevenueMonth();
            const nav = await db.getCategories()
            // console.log(orderDay)
            res.render('analyze',{
                user: req.user[0],
                orderListDay: JSON.stringify(orderDay.query),
                totalDay: orderDay.totalRevDay,
                orderListMonth: JSON.stringify(orderMonth.query),
                totalMonth: orderMonth.totalRevMonth,
                pageTitle: "Analyze",
                cateListNav: nav,
            });
        } catch (error) {
            next(error);
        }
    },
    getRevenueInDay: async (req, res, next) => {
        try {
            const orderDay = await shop_order.getRevenueDay();
            // console.log(orderDay);
            return orderDay;
        }
        catch(e){
            console.log(e);
        }
    }
    
}