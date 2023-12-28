const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/db.c');

router.get('/', databaseController.importData);


module.exports = router;
