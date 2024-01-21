const express = require('express');
const router = express.Router();
const passport = require('passport')
const {isAuthenticated, isNotAuthenticated} = require('../middlewares/auth.middleware')
//Config google oauth2
require('../configs/google-oauth2')
require('../configs/facebook-oauth2')

router.get('/google', isNotAuthenticated, passport.authenticate('google', {scope: ['email', 'profile']}));
router.get('/google/callback', isNotAuthenticated, passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/',
    failureFlash: true,
}))

router.get('/facebook',
  passport.authenticate('facebook',{ scope: ['email']}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
