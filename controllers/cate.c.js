const category = require('../models/cate.m')

module.exports = {
    loadCates: async (req,res,next) => {
        try {
            const cates = await category.getCates();
            console.log('Category list: ', cates);
            res.render("cate",{cateList: cates});
        } catch (error) {
            next(error);
        }
    },
}