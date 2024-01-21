const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.c');
const {isAuthenticated, isNotAuthenticated} = require('../middlewares/auth.middleware');


router.get('/', isAuthenticated, homeController.loadHome);

module.exports = router;