var FacebookStrategy = require( 'passport-facebook' ).Strategy;
require('dotenv').config();
const Users = require('../models/users.model')
const passport = require('passport')


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name'] 
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    //Assign id to username 
    const email = profile.emails[0].value ? profile.emails[0].value : 'none';
    const users = await Users.getUserByEmail(email);
    let user = users[0];
    if (!user) {
        user = {    
            role: 'client',
            email,
            username: profile.id,
            password: 'none',
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            phone: 'req.body.phone',
            city: 'req.body.city',
            street: 'req.body.street',
            zipcode: 'req.body.zipcode',
        }
        const data = await Users.insert(user);
    }
    return cb(null, user);
  }
));
passport.serializeUser((user,done) => done(null, user.email));
passport.deserializeUser(async(email,done) => done(null, await Users.getUserByEmail(email)));