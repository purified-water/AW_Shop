const express = require('express')
const router = express.Router();
const tokenController = require('../controllers/token.c')

router.post('/',tokenController.signJWT)

module.exports = router