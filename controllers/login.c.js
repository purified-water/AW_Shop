// const userModels = require('../models/user.m');
// const bcrypt = require('bcrypt')
const Users = require('../models/users.m');
const passport = require('passport');

module.exports = {

    login_get: (req, res, next) => {
        res.render("login");
    },
    logout_get: (req, res, next) => {
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