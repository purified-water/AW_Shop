const shop_order = require('../models/shop_order.m')
const detail_order = require('../models/detail_order.m')
const db = require('../utils/db');
module.exports = {
    loadOrder: async (req,res,next) => {
        try {       
            const order = await db.getAll('shop_order')
            // console.log(orderDay)
            res.render('analyze',{
                user: req.user[0],
                order: order,
                pageTitle: "Analyze",
                cateListNav: nav,
            });
        } catch (error) {
            next(error);
        }
    },
    loadDetailOrder: async (req, res, next) => {
        try {       
            const detail = await detail_order.getDetailOrder(req.body.order.order_id);
            // console.log(orderDay)
            res.render('analyze',{
                user: req.user[0],
                detail: detail,
                pageTitle: "Analyze",
                cateListNav: nav,
            });
        } catch (error) {
            next(error);
        }
    }
    
}