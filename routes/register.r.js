const express = require('express');
const router = express.Router();


const mainControllers = require('../controllers/register.c');

router.get('/',mainControllers.register_get)
router.post('/',mainControllers.register_post);

module.exports = router;
