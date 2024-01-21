const express = require('express');
const router = express.Router();
const prodController = require('../controllers/prod.c.js');

router.get('/',prodController.loadProductsWithCate);
router.post('/add', prodController.addProduct);
router.post('/edit/:productID', prodController.editProduct);
router.get('/delete', prodController.deleteProduct);
router.get('/detail',prodController.getProductDetail);
module.exports = router;