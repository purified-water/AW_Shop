const express = require('express');
const router = express.Router();
const passport = require('passport')
const initialize = require('../configs/passport-config')
const {login_post} = require('../middlewares/login_post.middleware')

initialize(passport);


const mainControllers = require('../controllers/login.c');

router.get('/',mainControllers.login_get)
router.post('/', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), login_post )

router.get('/logout', mainControllers.logout_get);

module.exports = router;
