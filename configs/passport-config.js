const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
    const authenticate = async (email, password, done) => {
        const user = getUserByEmail(email);
        console.log('user in passport-config', user)
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
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initialize