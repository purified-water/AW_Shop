const product = require('../models/prod.m')
const categories = require('../models/cate.m')

module.exports = {
    loadProductsWithCate: async (req, res, next) => {
        try {
            // Lấy danh sách categories
            // const cates = await categories.getCates();
            // Lấy product type - cate từ query
            const product_type = req.query.cate;
            // console.log('product_type: ', product_type);
            const prodList = await product.getProductsWithCate(product_type);
            // console.log('Product list: ', prodList);
            res.render("prod", { 
                product_type: product_type, 
                prodList: prodList,
                pageTitle: "Product List",
            });
        } catch (error) {
            next(error);
        }
    },
    getProductDetail: async (req, res, next) => {
        try {
            const productID = req.query.id;
            const productDetail = await product.getProductDetail(productID);
            // console.log('productDetail: ', productDetail);
            res.render("detail", { productDetail: productDetail[0], pageTitle: "Detail Product" }); // TO DO: SỬA chỗ này theo Trí
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
    
}