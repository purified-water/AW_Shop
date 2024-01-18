const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyze.c.js');

router.get('/',analyzeController.loadAnalyze);

module.exports = router;