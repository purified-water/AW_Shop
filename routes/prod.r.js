const express = require('express');
const router = express.Router();
const prodController = require('../controllers/prod.c.js');

router.get('/',prodController.loadProductsWithCate);
router.post('/edit/:productID', prodController.editProduct);
router.get('/delete/:productID', prodController.deleteProduct);
router.get('/detail',prodController.loadDetail);
module.exports = router;