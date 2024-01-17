const product = require('../models/prod.m')

module.exports = {
    loadProductsWithCate: async (req, res, next) => {
        try {
            // Lấy product type - cate từ query
            const product_type = req.query.cate;
            // console.log('product_type: ', product_type);
            const prodList = await product.getProductsWithCate(product_type);
            // console.log('Product list: ', prodList);
            res.render("prod", { product_type: product_type, prodList: prodList });
        } catch (error) {
            next(error);
        }
    },
    getProductDetail: async (req, res, next) => {
        try {
            const productID = req.params.productID;
            const productDetail = await product.getProductDetail(productID);
            res.render("detail", { productDetail: productDetail }); // TO DO: SỬA chỗ này theo Trí
        } catch (error) {
            next(error);
        }
    },
    addProduct: async (req, res, next) => {
        try {
            const { brand, name, price, imageLink, description, category, product_type, tag_list } = req.body;
            await product.addProduct(brand, name, price, imageLink, description, category, product_type, tag_list);
            res.redirect('/prod?cate=' + product_type); //TO DO: 1 là redirect lại 2 là ẩn modal
        } catch (error) {
            console.log(error);
        }
    },
    editProduct: async (req, res, next) => {
        try {
            const productID = req.params.productID;
            const product_type = req.body.product_type;
            const newProduct = req.body;
            await product.editProduct(productID, newProduct);
            res.redirect('/prod?cate=' + product_type); //TO DO: 1 là redirect lại 2 là ẩn modal
        } catch (error) {
            next(error);
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const productID = req.params.productID;
            const product_type = req.query.product_type;
            await product.deleteProduct(productID);
            res.redirect('/prod?cate=' + product_type);
        } catch (error) {
            next(error);
        }
    }
}