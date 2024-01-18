const express = require("express");

const vnpayController = require("../controllers/vnpay.c");

const router = express.Router({ mergeParams: true });

router.post("/vnpay-charge", vnpayController.VNPayCharge);
router.get("/vnpay-return", vnpayController.VNPayReturn);
router.get("/vnpay-ipn", vnpayController.VNPayIPN);

module.exports = router;
