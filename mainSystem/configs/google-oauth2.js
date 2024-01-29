var GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const Users = require('../models/users.m')
const passport = require('passport')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://localhost:3000/auth/google/callback",
  passReqToCallback: true
},
  async function (request, accessToken, refreshToken, profile, cb) {
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
        phone: '0373893504',
        city: 'HCM',
        street: '127 Nguyen Van Cu',
        zipcode: '460000',
      }
      const data = await Users.insert(user);
      
    }
    //khởi tạo user account
    const userQuery = await Users.getUserByEmail(profile.email);
    const account = {
      user_id: userQuery[0].id,
      balance: 0
    }
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // console.log('Google account is', account);
    const jsonRes = await fetch('https://localhost:8888/account/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ account })
    })
    const jsonRes2 = await jsonRes.json();
    if (jsonRes.status !== 200) {
      console.log('Error when create account');
      return res.status(500).json({ message: 'Error when create account' });
    } else {
      console.log('Message from account', jsonRes2.message);
    }
    // console.log('google', user);
    return cb(null, user);

  }
));

passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser(async (email, done) => done(null, await Users.getUserByEmail(email)));