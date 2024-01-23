const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.c');

router.get('/', cartController.renderCart);
router.post('/add', cartController.addItemToCartByID);
router.get('/increase/:id', cartController.increaseItemFromCartByID);
router.get('/reduce/:id', cartController.reduceItemFromCartByID);
router.get('/remove/:id', cartController.removeItemFromCartByID);
router.get('/info',cartController.loadFormInfo);
router.get('/payWithWallet',cartController.payWithWallet);

module.exports = router;