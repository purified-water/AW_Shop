const express = require('express');
const router = express.Router();   
const userController = require('../controllers/users.c');

router.post('/update/:id', userController.updateUser);
router.get('/profile',userController.loadProfile);
router.post('/profile/recharge', userController.rechargeBalance);
router.post('/profile/rechargeVNPay', userController.rechargeBalanceVNPay);
router.post('https://localhost:8888/order/create_payment_url', userController.redirectVnPay);
router.get('/manageuser', userController.loadListUser);
module.exports = router;