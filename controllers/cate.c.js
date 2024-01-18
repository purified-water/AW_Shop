const category = require('../models/cate.m')

module.exports = {
    loadCates: async (req,res,next) => {
        try {
            const cates = await category.getCates();
            // console.log('Category list: ', cates);
            res.render("cate",{cateList: cates});
        } catch (error) {
            next(error);
        }
    },
  

    editCate: async (req,res,next) => {
        try {
            const {oldCateName} = req.query.oldCateName;
            const {newCateName} = req.body.newCateName;
            await category.editCate(oldCateName, newCateName);
            res.redirect('/cate');
        } catch (error) {
            next(error);
        }
    },

    deleteCate: async (req,res,next) => {
        try {
            const {cateName} = req.params.cateName;
            await category.deleteCate(cateName);
            res.redirect('/cate');
        } catch (error) {
            next(error);
        }
    }
}