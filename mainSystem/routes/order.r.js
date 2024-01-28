const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.c');
// const {isAuthenticated, isNotAuthenticated} = require('../middlewares/auth.middleware');


router.get('/', orderController.loadOrder);
router.get('/detail/:order_id', orderController.loadOrderDetail);

module.exports = router;