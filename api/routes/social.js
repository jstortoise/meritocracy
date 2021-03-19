const express = require('express');
const FB = require('fb');

const Passport = require('../config/passport');
const Common = require('../controllers/common');

const router = express.Router();

router.get('/facebook/login/:secret', Common.verifyClient, Passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', Passport.authenticate('facebook', { failureRedirect: '/social/facebook/failure' }), (req, res) => {
    res.render('../views/fb-success.html', { token: req.user.accessToken });
});

router.get('/facebook/failure', (req, res) => {
    res.render('../views/fb-failure.html');
});

router.get('/facebook/detail/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const data = await FB.api('me', { fields: ['id', 'first_name', 'middle_name', 'last_name', 'email'], access_token: token });
        const { email, id: facebookId } = data;

        // Success
        res.send({ success: true, data: { email, facebookId } });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;
