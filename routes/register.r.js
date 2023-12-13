const express = require('express');
const router = express.Router();

const mainControllers = require('../controllers/register.c');

router.get('/',mainControllers.loadRegister)
router.post('/',mainControllers.signUp);

module.exports = router;
