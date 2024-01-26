const express = require('express');
const router = express.Router();
const passport = require('passport')
const {isAuthenticated, isNotAuthenticated} = require('../middlewares/auth.middleware')
const {login_post} = require('../middlewares/login_post.middleware')
//Config google oauth2
require('../configs/google-oauth2')
require('../configs/facebook-oauth2')

router.use(isNotAuthenticated)

router.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}));
router.get('/google/callback' , passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true,
}), login_post)

router.get('/facebook', passport.authenticate('facebook',{ scope: ['email']}));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }),login_post)

module.exports = router;
