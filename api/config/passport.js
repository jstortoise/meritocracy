var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config');

passport.use(new FacebookStrategy({
    clientID: config.FB_APP_ID,
    clientSecret: config.FB_APP_SECRET,
    callbackURL: config.BACK_END_URL + '/social/facebook/callback',
    profileFields: ['id', 'email', 'name']
}, (accessToken, refreshToken, profile, callback) => {
    var user = {
        accessToken: accessToken
    };
    return callback(null, user);
}));

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((obj, callback) => {
    callback(null, obj);
});

module.exports = passport;
