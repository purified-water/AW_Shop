const product = require('../models/prod.m')
const categories = require('../models/cate.m')

module.exports = {
    loadProductsWithCate: async (req, res, next) => {
        try {
            
            const product_type = req.query.cate;
            // console.log('product_type: ', product_type);
            const prodList = await product.getProductsWithCate(product_type);
            // console.log('Product list: ', prodList);
            res.render("prod", { product_type: product_type, prodList: prodList});
        } catch (error) {
            next(error);
        }
    },
    getProductDetail: async (req, res, next) => {
        try {
            const productID = req.query.id;
            const productDetail = await product.getProductDetail(productID);
            // console.log('productDetail: ', productDetail);
            res.render("detail", { productDetail: productDetail[0] }); // TO DO: SỬA chỗ này theo Trí
        } catch (error) {
            next(error);
        }
    },
    addProduct: async (req, res, next) => {
        try {
            const { brand, name, price, image_link, description, product_type } = req.body;
            await product.addProduct(brand, name, price, image_link, description, product_type);
            res.redirect('/product?cate=' + product_type);
        } catch (error) {
            console.log(error);
        }
    },
    editProduct: async (req, res, next) => {
        try {
            const productID = req.params.productID;
            const { brand, name, price, image_link, description, product_type} = req.body;
            await product.editProduct(productID, brand, name, price, image_link, description);
            res.redirect('/product?cate=' + product_type); //TO DO: 1 là redirect lại 2 là ẩn modal
        } catch (error) {
            next(error);
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const productID = req.query.id;
            const product_type = req.query.product_type;
            await product.deleteProduct(productID);
            res.redirect('/product?cate=' + product_type);
        } catch (error) {
            next(error);
        }
    },

    filterProduct: async (req, res, next) => {
        try {
            const product_type = req.query.cate;
            const filter = req.query.filter;
            const prodList = await product.filter(product_type, filter);
            res.render("prod", { product_type: product_type, prodList: prodList});
        } catch (error) {
            next(error);
        }
    },
    searchProduct: async (req, res, next) => {
        try {
            // const product_type = req.query.cate;
            const search = req.query.search;
            const prodList = await product.search( search);
            const cateList = await categories.search(search);
            console.log('Product list: ', prodList);
            console.log('Cate list: ', cateList);
            res.render("prod", { prodList: prodList, cateList: cateList});
        } catch (error) {
            next(error);
        }
    }
    
}