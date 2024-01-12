const product = require('../models/prod.m')

module.exports = {
    loadProductsWithCate: async (req,res,next) => {
        try {
            // Lấy product type - cate từ query
            const product_type = req.query.cate;
            console.log('product_type: ', product_type);
            const prodList = await product.getProductsWithCate(product_type);
            // console.log('Product list: ', prodList);
            res.render("prod",{product_type: product_type, prodList: prodList});
        } catch (error) {
            next(error);
        }
    },
}