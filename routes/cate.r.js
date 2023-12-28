const express = require('express');
const router = express.Router();
const cateController = require('../controllers/cate.c.js');

router.get('/',cateController.loadCates);

module.exports = router;