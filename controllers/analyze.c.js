const shop_order = require('../models/shop_order.m')

module.exports = {
    loadAnalyze: async (req,res,next) => {
        try {       
            const orderDay = await shop_order.getRevenueDay();
            console.log(orderDay);
            res.render('analyze',{orderList: orderDay.query, total: orderDay.totalRevDay});
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