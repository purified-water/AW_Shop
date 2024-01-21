const express = require('express');
const router = express.Router();   
const userController = require('../controllers/users.c');

router.post('/update/:id', userController.updateUser);
router.get('/profile',userController.loadProfile);
module.exports = router;