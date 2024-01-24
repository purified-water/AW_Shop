const product = require('../models/prod.m')
const categories = require('../models/cate.m')
const db = require('../utils/db');
function sortByAttribute(prodList, filter) {
    switch( filter) {
        case 'Z_A':
            return prodList.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1);
            return 
        case 'Price_low_to_high':
            return prodList.sort((a,b) => a.price - b.price);
        case 'Price_high_to_low':
            return prodList.sort((a,b) => b.price - a.price);
        default:
            return prodList.sort((a,b) => b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 1);

    }
}

module.exports = {
    loadProductsWithCate: async (req, res, next) => {
        try {
            console.log(req.query);
            const filter = req.query.filter ? req.query.filter : '';
            const product_type = req.query.cate;
            const page = req.query.page ? req.query.page: 1;
            const offset = 9*(page-1);
            const itemsPerPage = 9;
            const total = await product.countProductsWithTcate(product_type);
            // console.log(total);
            // console.log('product_type: ', product_type);
            // const prodList = await product.getProductsWithCate(product_type);
            const prodList = await product.getProductsWithCatePerPage(product_type, offset, itemsPerPage);
            const nav = await db.getCategories()
            res.render("prod", { 
                user: req.user[0],
                product_type: product_type, 
                prodList: prodList, 
                total, 
                page, 
                pageTitle: "Product List",
                cateListNav: nav,
            });

        } catch (error) {
            next(error);
        }
    },
    getProductDetail: async (req, res, next) => {
        try {
            const productID = req.query.id;
            const productDetail = await product.getProductDetail(productID);
            const similarProducts = await product.getSimilarProducts(productDetail[0].product_type);
            const nav = await db.getCategories();
            // console.log('productDetail: ', productDetail);
            res.render("detail", {
                user: req.user[0], 
                productDetail: productDetail[0], 
                pageTitle: "Detail Product", 
                similarProducts: similarProducts,
                cateListNav: nav,
            }); // TO DO: SỬA chỗ này theo Trí

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
            const nav = await db.getCategories();
            res.render("prod", {
                user: req.user[0], 
                product_type: product_type, 
                prodList: prodList, 
                pageTitle: "Filter Product", 
                cateListNav: nav,
            });
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
            const nav = await db.getCategories();
            // console.log('Product list: ', prodList);
            // console.log('Cate list: ', cateList);
            res.render("search", {
                user: req.user[0], 
                prodList: prodList, 
                cateList: cateList,
                pageTitle: "Filter Product", 
                cateListNav: nav,
            });
        } catch (error) {
            next(error);
        }
    }
    
}