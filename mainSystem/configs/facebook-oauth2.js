var FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
const Users = require('../models/users.m')
const passport = require('passport')


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "https://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name']
},
  async function (accessToken, refreshToken, profile, cb) {
    // console.log(profile);
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
    //khởi tạo user account
    const userQuery = await Users.getUserByEmail(profile.emails[0].value);
    const account = {
      user_id: userQuery[0].id,
      balance: 0
    }
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


    // console.log('Facebook account is', account);
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
    return cb(null, user);
  }
));
passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser(async (email, done) => done(null, await Users.getUserByEmail(email)));