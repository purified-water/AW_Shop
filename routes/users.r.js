const express = require('express');
const router = express.Router();   
const userController = require('../controllers/users.c');

router.post('/update/:id', userController.updateUser);

module.exports = router;