var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('dotenv').config();
const Users = require('../models/users.m')
const passport = require('passport')

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, cb) {
    const users = await Users.getUserByEmail(profile.email);
    let user = users[0];
    //Already signed up
    if (!user) { //Not used before
        user = {    
            role: 'client',
            email: profile.email,
            username: 'none',
            password: 'none',
            firstname: profile.given_name,
            lastname: profile.family_name,
            phone: 'req.body.phone',
            city: 'req.body.city',
            street: 'req.body.street',
            zipcode: 'req.body.zipcode',
        }
        const data = await Users.insert(user);
    }
    console.log('google', user);
    return cb(null, user);

  }
));

passport.serializeUser((user,done) => done(null, user.email));
passport.deserializeUser(async(email,done) => done(null, await Users.getUserByEmail(email)));