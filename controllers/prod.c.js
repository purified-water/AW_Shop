const product = require('../models/prod.m')

module.exports = {
    loadProductsWithCate: async (req,res,next) => {
        try {
            const catID = 1
            const prodList = await product.getProductsWithCate(catID);
            res.render("prod",{catName: 'temp', catID: 1, prodList: prodList});
        } catch (error) {
            next(error);
        }
    },
}