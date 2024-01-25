// const userModels = require('../models/user.m');
// const bcrypt = require('bcrypt')
const Users = require('../models/users.m');
const passport = require('passport');
const maxAge = 60 * 60 * 1000;

module.exports = {

    login_get: (req, res, next) => {
        res.render("login",{pageTitle: "Login"});
    },
    logout_get: (req, res, next) => {
        res.cookie('jwt', '', {maxAge: 1});
        req.logout((err) => {
            if (err) {
                return next(err);
            }

            // Clear user-related data from the session
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                }
                res.redirect('/'); // Redirect to the homepage or any desired destination after logout
            });
        });

    },
}