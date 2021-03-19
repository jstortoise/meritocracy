const express = require('express');
const jwt = require('jsonwebtoken');
const FB = require('fb');

const Cronjob = require('../controllers/cronjob');
const Common = require('../controllers/common');
const Email = require('../controllers/email');
const Keycloak = require('../controllers/keycloak');
const MyClient = require('../controllers/myClient');
const Notification = require('../controllers/notification');
const Score = require('../controllers/score');
const Social = require('../controllers/social');
const User = require('../controllers/user');

const router = express.Router();
const { FRONT_END_URL } = require('../config');

router.post('/signup', Common.verifyCertSecret, async (req, res) => {
    try {
        const { firstName, lastName, username, password, email } = req.body;
        let message = 'Sign up success', isValid = false;

        // Check fields valid
        if (!firstName) {
            message = 'First name is empty';
        } else if (!lastName) {
            message = 'Last name is empty';
        } else if (!username) {
            message = 'User name is empty';
        } else if (!email) {
            message = 'Email is empty';
        } else if (!password) {
            message = 'Password is empty';
        } else {
            isValid = true;
        }

        // Check valid
        if (!isValid) {
            res.send({ success: false, message });
            return;
        }

        // Check username
        const oldUser = await User.findOne({ username });
        if (oldUser) {
            res.send({ success: false, message: 'Username already exists' });
            return;
        }

        // check if same email exists verified
        const oldEmail = await Email.findOne({ email, $or: [{ isVerified: 1 }, { isPrimary: 1 }] });
        if (oldEmail) {
            res.send({ success: false, message: 'Email already exists' });
            return;
        }

        // Create user on DB
        const user = await User.create({ username, password, firstName, lastName, email, role: 2 });

        // Create user info in myclients table on DB
        const client = req.authData;
        await MyClient.create({ userId: user.id, clientId: client.id });

        // Get login token from Keycloak
        const tokens = await Keycloak.login(username, password, client);
        const token = Common.generateToken(tokens, client.secret);

        // Generate email verification id
        const verifyId = jwt.sign({ userId: user.id, email }, FRONT_END_URL, {
            expiresIn: 3600 * 12 // 12 hours
        });
        
        // Send verification email
        const url = `${FRONT_END_URL}/verify_email/${verifyId}`;
        const toAddress = email;
        const subject = '[Meritocracy] Please verify your account';
        const html = `
            <p>Hi ${firstName} ${lastName},</p>
            <p>Thanks for your interest joining Meritocracy. To complete your registration, we need you to verify your email address.</p>
            <p>Please click <a href='${url}'>here</a> to verify your email.</p>
            <p>This link will expire within 12 hours.</p>
            <p>Thanks,<br/>Your friends at Meritocracy</p>
        `;
        await Common.sendEmail(toAddress, subject, html);

        // Add notification
        const description = 'The verification email has been sent. Please verify your email in order to unlock x Merit Points and get full features access.';
        await Notification.create({ type: 1, userId: user.id, description });

        // Success
        res.send({ success: true, data: { user, token }, message: 'Sign up success' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/facebook/signup', Common.verifyCertSecret, async (req, res) => {
    try {
        const { fbToken } = req.body;
        const { appkey: secret } = req.headers;
        const { id: clientId } = req.authData;

        let tokens = null;

        if (!fbToken) {
            res.send({ success: false, message: 'Facebook authentication failed' });
            return;
        }
        
        const data = await FB.api('me', { fields: ['id', 'first_name', 'middle_name', 'last_name', 'email'], access_token: fbToken });
        
        const { email, last_name: lastName, id: facebookId, first_name, middle_name } = data;
        const firstName = first_name + (middle_name ? ' ' + middle_name : '');

        // check if exists with username
        const user = await User.findOne({ username: email });
        if (user) {
            res.send({ success: false, message: 'The email is already in use on Meritocracy' });
            return;
        }

        const userEmail = await Email.findOne({ email, $or: [{ isVerified: 1 }, { isPrimary: 1 }] });
        if (userEmail) {
            // Update user with Facebook
            const { id: emailId, userId } = userEmail;
            const socialEmail = await Social.findOne({ emailId });
            if (socialEmail) {
                res.send({ success: false, message: 'The email is already in use on Meritocracy' });
                return;
            }
            tokens = await User.updateWithFacebook({ userId, email, emailId, facebookId, firstName, lastName }, clientId);
            var { username } = await User.findOne({ id: userId });
        } else {
            // Create new user with Facebook
            tokens = await User.createWithFacebook({ email, facebookId, firstName, lastName, role: 2 }, clientId);
            var username = email;
        }
        
        // Generate token
        const token = Common.generateToken(tokens, secret);
        
        // Success
        res.send({ success: true, data: { token, username }, message: 'Sign up with Facebook success' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/login', Common.verifyCertSecret, Common.fbOrgLogin, async (req, res) => {
    try {
        const { username, password } = req.body;
        const { appkey: secret } = req.headers;

        // Check user login and get token from Keycloak
        const tokens = await User.login(username, password, secret);

        // Generate Meritocracy token
        const token = Common.generateToken(tokens, secret);

        // Success
        res.send({ success: true, data: { token } });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Set test score
router.post('/score/update', Common.verifyOrgToken, async (req, res) => {
    try {
        const { id: userId, client } = req.authData;
        const data = { ...req.body, userId, clientId: client.id };
        await Score.upsert(data);

        // Success
        res.send({ success: true, message: 'Score updated scucessfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Get test score
router.get('/score/detail', Common.verifyOrgToken, async (req, res) => {
    try {
        const { id: userId, client } = req.authData;
        const scores = await Score.findAll({ userId, clientId: client.id });

        // Success
        res.send({ success: true, data: scores });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/calcm2m', Common.verifyOrgToken, async (req, res) => {
    const { ratings } = req.body; // e.g. [{ username: "test1", rating: 5 }, { username: "test2", rating: 4 }]
    const { id: clientId } = req.authData.client;
    res.send({ success: true, message: 'Received successfully' });

    // Run cronjob
    try {
        // 1. calc member merit points
        await Cronjob.calcMemberRating();

        // 2. calc m2m rating
        await Cronjob.calcM2MRating(ratings, clientId);

        // 3. calc consistency
        await Cronjob.calcConsistency();
        // 4. calc org merit points
        await Cronjob.calcOrgMeritPoints();
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;