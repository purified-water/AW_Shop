const express = require('express');
const router = express.Router();


const mainControllers = require('../controllers/login.c');

router.get('/', mainControllers.logout_get);

module.exports = router;
