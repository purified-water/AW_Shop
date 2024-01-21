const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/db.c');

router.get('/', databaseController.importData);
router.get('/init', databaseController.initUsers);


module.exports = router;
