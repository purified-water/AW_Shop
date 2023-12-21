const LocalStrategy = require('passport-local').Strategy
const Users = require('../models/users.model')
const bcrypt = require('bcrypt')

function initialize(passport) {
    const authenticate = async (email, password, done) => {
        console.log(email, password)
        const users = await Users.getUserByEmail(email);
        const user = users[0];
        // console.log('user in passport-config', user)
        if (!user) {
            return done(null, false, { message: 'No user with that email'});
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

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password'},authenticate))
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => done(null, await Users.getUserById(id)));
}

module.exports = initialize