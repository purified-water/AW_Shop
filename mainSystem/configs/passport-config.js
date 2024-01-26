const LocalStrategy = require('passport-local').Strategy
const { default: axios } = require('axios')
const Users = require('../models/users.m')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Disable SSL certificate validation for development/testing purposes
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function initialize(passport) {
    const authenticate = async (username, password, done) => {
        console.log(username, password)
        const users = await Users.getUserByUsername(username);
        const user = users[0];
        // console.log('user in passport-config', user)
        if (!user) {
            return done(null, false, { message: 'No user with that username'});
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);    
            }
            else {
                return done(null, false, { message: 'Password incorrect'})
            }
         
        } catch(e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password'},authenticate))
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => done(null, await Users.getUserById(id)));
}

module.exports = initialize