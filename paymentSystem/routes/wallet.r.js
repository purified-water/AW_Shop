const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.c');

router.post('/payWithWallet', paymentController.payWithWallet);
router.post('/payWithVNPay', paymentController.payWithVNPay);
router.post('/recharge', paymentController.rechargeBalance)
module.exports = router;