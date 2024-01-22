const express = require('express');
const router = express.Router();
const prodController = require('../controllers/prod.c.js');
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(req);
        cb(null,'./mainSystem/public/images2')
    },
    filename: (req, file, cb) => {
        // console.log(file);
        cb(null,  file.originalname)
    }
})
const upload = multer({storage: storage})

router.get('/',prodController.loadProductsWithCate);
router.post('/add', upload.single('image'), prodController.addProduct);
router.post('/edit/:productID', upload.single('image'), prodController.editProduct);
router.get('/delete', prodController.deleteProduct);
router.get('/detail',prodController.getProductDetail);
router.get('/search',prodController.searchProduct);
router.get('/filter',prodController.filterProduct);
module.exports = router;