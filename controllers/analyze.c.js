const shop_order = require('../models/shop_order.m')

module.exports = {
    loadAnalyze: async (req,res,next) => {
        try {       
            res.render('analyze');
        } catch (error) {
            next(error);
        }
    },
}