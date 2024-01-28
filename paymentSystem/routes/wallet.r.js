const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.c');
const {verifyJWT} = require('../middlewares/verifyJWT.m')


router.post('/payWithWallet', verifyJWT, paymentController.payWithWallet);
router.post('/recharge', paymentController.rechargeBalance)
module.exports = router;