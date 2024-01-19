const express = require('express');
const router = express.Router();
const cateController = require('../controllers/cate.c.js');

// router.get('/',cateController.getAllCates);
router.get('/',cateController.loadCates);
router.post('/edit',cateController.editCate);
router.get('/delete/:cateName',cateController.deleteCate);

module.exports = router;