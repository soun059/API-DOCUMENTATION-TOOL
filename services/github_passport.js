// REQUIRE
const passport = require('passport');
const GitHubStrategy = require('passport-github2');
require('dotenv').config();

passport.use(new GitHubStrategy({
    clientID: process.env.github_client_id,
    clientSecret: process.env.github_client_secret,
    callbackURL: '/auth/github/redirect'
}, (acessToken, refreshToken, profile, done) => {
        done(null, profile);
}));