const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.c');

// XỬ LÝ JWT TOKEN CHỖ NÀY
router.post('/add', accountController.addAccount)

module.exports = router;