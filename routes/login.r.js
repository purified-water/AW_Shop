const express = require('express');
const router = express.Router();
const passport = require('passport')
const initialize = require('../configs/passport-config')
const {users } = require('../controllers/register.c')

console.log(users);

initialize(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id))


const mainControllers = require('../controllers/login.c');

router.get('/',mainControllers.login_get)
router.post('/',passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

module.exports = router;
