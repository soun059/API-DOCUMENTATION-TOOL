// REQUIRE
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();

// PASSPORT Strategy
passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: process.env.client_id,
    clientSecret: process.env.client_secret,
}, (accessToken, refreshToken, profile, done) => {
       // console.log(profile)
        done(null, profile);
}));
