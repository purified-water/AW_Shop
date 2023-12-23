const express = require('express');
const router = express.Router();
const passport = require('passport')
const initialize = require('../configs/passport-config')

initialize(passport);


const mainControllers = require('../controllers/login.c');

router.get('/',mainControllers.login_get)
router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

module.exports = router;
