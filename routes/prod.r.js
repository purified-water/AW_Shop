const express = require('express');
const router = express.Router();
const prodController = require('../controllers/prod.c.js');

router.get('/',prodController.loadProductsWithCate);

module.exports = router;