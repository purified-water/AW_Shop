const cate = require('../models/cate.m')

module.exports = {
    loadCates: async (req,res,next) => {
        try {
            const cates = await cate.getCates();
            res.render("cate",{cateList: cates});
        } catch (error) {
            next(error);
        }
    },
}