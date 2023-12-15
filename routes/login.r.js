const express = require('express');
const router = express.Router();

const mainControllers = require('../controllers/login.c');

router.get('/',mainControllers.loadLogin)
router.post('/',mainControllers.loginApp);

module.exports = router;
