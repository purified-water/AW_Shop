var FacebookStrategy = require( 'passport-facebook' ).Strategy;
require('dotenv').config();
const Users = require('../models/users.m')
const passport = require('passport')


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://localhost:3000/auth/facebook/callback",
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
            phone: '0373893504',
            city: 'HCM',
            street: '127 Nguyen Van Cu',
            zipcode: '460000',
        }
        const data = await Users.insert(user);
    }
    return cb(null, user);
  }
));
passport.serializeUser((user,done) => done(null, user.email));
passport.deserializeUser(async(email,done) => done(null, await Users.getUserByEmail(email)));