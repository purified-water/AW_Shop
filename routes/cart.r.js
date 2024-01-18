const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.c');

router.get('/', cartController.renderCart);
router.post('/add', cartController.addItemToCartByID);

module.exports = router;