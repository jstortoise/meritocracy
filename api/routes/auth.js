const express = require('express');
const jwt = require('jsonwebtoken');
const FB = require('fb');
const svgCaptcha = require('svg-captcha');

const BaseDetail = require('../controllers/baseDetail');
const Badge = require('../controllers/badge');
const Common = require('../controllers/common');
const Email = require('../controllers/email');
const Keycloak = require('../controllers/keycloak');
const User = require('../controllers/user');
const Notification = require('../controllers/notification');
const Social = require('../controllers/social');
const Wallet = require('../controllers/wallet');
const WalletAPI = require('../meritocracy-wallets-api');

const router = express.Router();
const {
    FRONT_END_URL,
    KC_CLIENT_SECRET,
    FACEBOOK_PREFIX,
    KC_MAIL_DOMAIN
} = require('../config');

// Sign up
router.post('/signup', async (req, res) => {
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
        const user = await User.create({ username, password, firstName, lastName, email, role: 3 });

        // Get login token from Keycloak
        const tokens = await Keycloak.login(username, password);
        const token = Common.generateToken(tokens);

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
        res.send({ success: true, data: { token }, message: 'Sign up success' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Sign up with Facebook
router.post('/facebook/signup', async (req, res) => {
    try {
        const { fbToken } = req.body;
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
            tokens = await User.updateWithFacebook({ userId, email, emailId, facebookId, firstName, lastName });
        } else {
            // Create new user with Facebook
            tokens = await User.createWithFacebook({ email, facebookId, firstName, lastName, role: 3 });
        }
        
        // Generate token
        const token = Common.generateToken(tokens);
        
        // Success
        res.send({ success: true, data: { token }, message: 'Sign up with Facebook success' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Login
router.post('/login', Common.fbLogin, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check user login and get token from Keycloak
        const tokens = await User.login(username, password);

        // Generate Meritocracy token
        const token = Common.generateToken(tokens);

        // Success
        res.send({ success: true, data: { token } });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.get('/logout', Common.verifyToken, async (req, res) => {
    const token = req.headers['x-token'];

    try {
        const { accessToken, refreshToken } = jwt.verify(token, KC_CLIENT_SECRET);
        
        // Log out from Keycloak
        await Keycloak.logout(accessToken, refreshToken);
        
        // Success
        res.send({ success: true, message: 'Logout success' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Generate captcha image and text
router.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create({ color: true });
    res.send({ success: true, data: captcha });
});

// Send forgot email
router.get('/forgot/:email', async (req, res) => {
    try {
        const { email } = req.params;
    
        // Check if email exists
        const userEmail = await Email.findOne({ email, isVerified: 1, isActive: 1 });
        if (!userEmail) {
            res.send({ success: false, message: 'Email not found' });
            return;
        }

        const { userId } = userEmail;

        // Get user info
        const user = await User.findOne({ id: userId });
        if (!user) {
            res.send({ success: false, message: 'User not found' });
            return;
        }
        
        // Set resetPassword flag on DB
        await Email.update({ isResetPwd: 1 }, { userId, email });

        // Generate reset link
        const resetId = jwt.sign({ userId, email }, FRONT_END_URL, {
            expiresIn: 10800
        });
        const resetUrl = `${FRONT_END_URL}/forgot/reset/${resetId}`;
        const forgotUrl = FRONT_END_URL + '/forgot';

        // Generate email contents
        const subject = '[Meritocracy] Reset your password';
        const html = `
            <p>We heard that you lost your Meritocracy password. Sorry about that!</p>
            <p>But don't worry! You can use the following link to reset your password:</p>
            <p><a href='${resetUrl}'>${resetUrl}</a></p>
            <p>If you don't use this link within 3 hours, it will expire. To get a new password reset link, visit <a href='${forgotUrl}'>${forgotUrl}</a></p>
            <p>Thanks,<br/>Your friends at Meritocracy</p>
        `;
        
        // Send email
        await Common.sendEmail(email, subject, html);
        
        // Success
        res.send({ success: true, data: 'Password reset request has been sent. Please check your email.' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Check reset password link
router.get('/reset/:resetId', async (req, res) => {
    try {
        const { resetId } = req.params;
        const { userId, email } = jwt.verify(resetId, FRONT_END_URL);

        // Get email from DB
        const { isResetPwd } = await Email.findOne({ email, userId });

        // Check reset flag
        if (isResetPwd) {
            res.send({ success: true, message: 'Valid link' });
        } else {
            res.send({ success: false, message: 'Invalid link1' });
        }
    } catch(e) {
        // Failed
        res.send({ success: false, message: 'Invalid link2' });
    }
});

// Reset your password
router.post('/reset/:resetId', async (req, res) => {
    try {
        const { resetId } = req.params;
        const { email, password } = req.body;
        const { userId, email: resetEmail } = jwt.verify(resetId, FRONT_END_URL);

        // Check resetId
        if (email != resetEmail) {
            res.send({ success: false, message: 'Invalid email' });
            return;
        }
        
        // Get user from DB
        const user = await User.findOne({ id: userId });
        if (!user) {
            res.send({ success: false, message: 'Invalid link' });
            return;
        }
        
        // Reset password on DB
        await User.updateOnly({ password }, { id: userId });

        // Reset password on Keycloak
        await Keycloak.resetPassword(userId, password);
        
        // Set reset password flag as false on DB
        await Email.update({ isResetPwd: 0 }, { userId, email });
        
        // Success
        res.send({ success: true, message: 'Reset password success' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: 'Invalid link' });
    }
});

// Send verification email
router.get('/verify/send/:email', Common.verifyToken, async (req, res) => {
    try {
        const { email } = req.params;
        const { id: userId, firstName, lastName } = req.authData;

        // generate verify link
        const verifyId = jwt.sign({ userId, email }, FRONT_END_URL, {
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
        await Notification.create({ type: 1, userId, description });

        // Success
        res.send({ success: true, message: 'Sent verification email successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Verify email link
router.get('/verify/email/:verifyId', async (req, res) => {
    const { verifyId } = req.params;

    try {
        const { userId, email } = jwt.verify(verifyId, FRONT_END_URL);

        const userEmail = await Email.findOne({ userId, email });

        // Check verifyId and email
        if (!userEmail) {
            res.send({ success: false, message: 'Invalid link' });
        } else if (Email.isVerified) {
            res.send({ success: false, message: 'Invalid link' });
        } else {
            // Set isVerified as true
            await Email.update({ isVerified: 1 }, { userId, email });

            // Suspend other emails
            await Email.update({ isActive: 0 }, { email, userId: { $ne: userId } });

            // Add badge for email verification
            await Badge.create({ userId, badgeType: 0 });

            // Add notification for email verification
            await Notification.create({ type: 0, userId, description: 'Email verified successfully. Your account is activated now.' });

            // Generate ETH wallet address
            const wallet = await Wallet.findOne({ userId, coinType: 1 });
            if (!wallet) {
                const { address, privateKey } = await WalletAPI.generateAddress(1);
                await Wallet.create({ coinType: 1, address, privateKey, userId });
            }

            // Success
            res.send({ success: true, message: 'Your email is successfully verified' });
        }
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/social/:socialType/add', Common.verifyToken, async (req, res) => {
    try {
        const { socialToken, originId } = req.body;
        const { socialType } = req.params;
        const { id: userId, firstName, lastName } = req.authData;
    
        const data = await FB.api('me', { fields: ['id', 'email'], access_token: socialToken });
        const { email, id: facebookId } = data;

        // Gheck email
        const userEmail = await Email.findOne({ email, userId });
        if (!userEmail) {
            res.send({ success: false, message: 'Email not found' });
            return;
        }
        
        const { id: emailId, isActive, isVerified } = userEmail;
        if (!isActive) {
            res.send({ success: false, message: 'This email is suspended' });
            return;
        }
        
        const socialEmail = await Social.findOne({ emailId, socialType });
        if (socialEmail) {
            res.send({ success: false, message: 'Already added' });
            return;
        }
        
        // Add new social user on Keycloak
        const { id: keycloakId } = await Keycloak.createUser({
            username: FACEBOOK_PREFIX + facebookId,
            password: facebookId,
            email: FACEBOOK_PREFIX + facebookId + KC_MAIL_DOMAIN,
            firstName,
            lastName
        });
        
        // Add social email
        await Social.create({ emailId, socialType, socialId: facebookId, originId, keycloakId });

        // Set email as verified
        if (!isVerified) {
            await Email.update({ isVerified: 1 }, { email, userId });
        }
        
        // Success
        res.send({ success: true, message: 'Added social email successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Identify socialId and current user
router.post('/social/:socialType/identify', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const { socialType } = req.params;
        const { originId, socialToken } = req.body;

        // Get social info from Facebook
        const data =  await FB.api('me', { fields: ['id', 'email'], access_token: socialToken });
        const { email, id: facebookId } = data;

        // Get email from DB
        const userEmail = await Email.findOne({ userId, email, isVerified: 1 });
        if (!userEmail) {
            res.send({ success: false, message: 'Invalid social account' });
            return;
        }

        // Get social email info from DB
        const { id: emailId } = userEmail;
        const socialEmail = await Social.findOne({ emailId, socialId: facebookId, socialType });
        if (!socialEmail) {
            res.send({ success: false, message: 'Invalid social account' });
            return;
        }

        // Check if social originId exists
        if (socialEmail.originId) {
            res.send({ success: false, message: 'Already identified' });
            return;
        }
        
        // Add social originId to DB
        await Social.update({ originId }, { emailId, socialId: facebookId, socialType });
        
        // Success
        res.send({ success: true, message: 'Successfully identified'});
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Get settings info
router.get('/settings', Common.verifyToken, async (req, res) => {
    try {
        const { accessTokenLifespan } = await Keycloak.getRealm();
        
        // get Base info
        const { value: tokenPerTip } = await BaseDetail.findOne({ baseType: 4, code: 0 });
        const { value: tipAmountAccumulation } = await BaseDetail.findOne({ baseType: 4, code: 1 });
        
        // Success
        res.send({ success: true, data: { accessTokenLifespan, tokenPerTip, tipAmountAccumulation } });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Update settings
router.post('/settings', Common.verifyToken, async (req, res) => {
    try {
        const { accessTokenLifespan, tokenPerTip, tipAmountAccumulation } = req.body;

        // Update accessTokenLifespan on Keycloak
        await Keycloak.updateRealm({ accessTokenLifespan });
    
        // Update tokenPerTip, tipAmountAccumulation on DB
        const dataArr = [{
            data: { value: tokenPerTip },
            where: { baseType: 4, code: 0 }
        }, {
            data: { value: tipAmountAccumulation },
            where: { baseType: 4, code: 1 }
        }];

        await BaseDetail.updateMany(dataArr);
        
        // Success
        res.send({ success: true, data: 'Update success' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Update profile
router.post('/profile/update', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const { firstName, lastName, secondEmails } = req.body;

        // Check if email verified
        const userEmail = await Email.findOne({ userId, isVerified: 1 });
        if (!userEmail) {
            res.send({ success: false, message: 'You cannot save changes before email verification' });
            return;
        }

        for (const obj of secondEmails) {
            const { email, socialEmails } = obj;

            // Check if other users have same email as primary or verified
            const userEmail = await Email.findOne({
                userId: { $ne: userId },
                email,
                $or: [{ isVerified: 1 }, { isPrimary: 1, isActive: 1 }]
            });
            if (!userEmail) continue;

            const oldEmail = await Email.findOne({ userId, email });
            if (!oldEmail) {
                res.send({ success: false, message: `${email} already exists` });
                return;
            }

            if (!socialEmails) continue;

            const { id: emailId } = userEmail;
            for (const { socialType, socialId } of socialEmails) {
                const socialEmail = await Social.findOne({ emailId, socialType, socialId });
                if (!socialEmail) continue;
                
                // Get social name from base table
                const { title: socialName } = await BaseDetail.findOne({ baseType: 5, code: socialType });
                
                // Failed
                res.send({ success: false, message: `${email} already linked to ${socialName}` });
                return;
            }
        }
    
        // Update user info
        await User.update({ firstName, lastName }, { id: userId });
    
        // Get old email list
        const oldEmails = await Email.findAll({ userId });
    
        for (const old of oldEmails) {
            const { id: emailId, userId, email, isPrimary } = old;
            const obj = secondEmails.find(obj => obj.email == email);

            if (!obj) {
                // Remove deleted emails and social infos from DB and Keycloak
                if (isPrimary) continue;

                // Remove social emails for deleted email
                const socialEmails = await Social.findAll({ emailId });
                if (socialEmails) {
                    for (const { id, keycloakId } of socialEmails) {
                        await Social.remove({ id })
                        await Keycloak.removeUser({ id: keycloakId });
                    }
                }

                // Remove deleted emails from DB
                await Email.remove({ id: emailId });
            } else {
                // Update emails
                const { socialEmails } = obj;
                if (socialEmails.length > 0) {
                    // Update email status as verified and active
                    await Email.update({ isVerified: 1, isActive: 1 }, { id: emailId });

                    // Create or Update social infos
                    for (const { socialType, socialId } of socialEmails) {
                        // Check if social info exists
                        const socialEmail = await Social.findOne({ emailId, socialType });

                        if (socialEmail) {
                            // Update social info
                            const { socialId: oldSocialId, keycloakId: oldKeycloakId } = socialEmail;

                            // Check if new socialId and old socialId are same
                            if (oldSocialId == socialId) continue;
                            
                            // Remove old from Keycloak
                            await Keycloak.removeUser({ id: oldKeycloakId });

                            // Create new on Keycloak
                            const { id: keycloakId } = await Keycloak.createUser({
                                username: FACEBOOK_PREFIX + socialId,
                                password: socialId,
                                email: FACEBOOK_PREFIX + socialId + KC_MAIL_DOMAIN,
                                firstName,
                                lastName
                            });

                            // Update db
                            await Social.update({ socialId, keycloakId }, { emailId, socialType });
                        } else {
                            // Create new on Keycloak
                            const { id: keycloakId } = await Keycloak.createUser({
                                username: FACEBOOK_PREFIX + socialId,
                                password: socialId,
                                email: FACEBOOK_PREFIX + socialId + KC_MAIL_DOMAIN,
                                firstName,
                                lastName
                            });
    
                            // Update db
                            await Social.create({ emailId, socialType, socialId, keycloakId });
                        }
                    }
                } else {
                    // Remove social infos from DB
                    const socialEmail = await Social.findOne({ emailId });
                    if (!socialEmail) continue;

                    await Keycloak.removeUser({ id: socialEmail.keycloakId });
                    await Social.remove({ emailId });
                }
            }
        }
    
        // 
        for (const { email, isPrimary, socialEmails } of secondEmails) {
            if (oldEmails.find(old => old.email == email)) continue;
                
            // Add new emails
            let isVerified = 0;

            // Check if social emails added
            if (socialEmails && socialEmails.length > 0) {
                isVerified = 1;
            }

            // Check only secondary emails
            if (!isPrimary) {
                // Create new email on DB
                const { id: emailId } = await Email.create({ email, userId, isVerified, isPrimary });

                // Create social infos on DB and Keycloak
                for (const { socialId, socialType } of socialEmails) {
                    // Add new social on Keycloak
                    const { id: keycloakId } = await Keycloak.createUser({
                        username: FACEBOOK_PREFIX + socialId,
                        password: socialId,
                        email: FACEBOOK_PREFIX + socialId + KC_MAIL_DOMAIN,
                        firstName,
                        lastName
                    });

                    // Add new social on DB
                    await Social.create({ emailId, socialType, keycloakId });
                }

                // Send verification email to unverified emails
                if (isVerified) continue;
                
                // Send verify email
                const user = { id: userId, email };
                
                // Generate verify link
                const verifyId = jwt.sign(user, FRONT_END_URL, {
                    expiresIn: 3600 * 12 // 12 hours
                });
                const url = `${FRONT_END_URL}/verify_email/${verifyId}`;

                // Create email subject and body
                const subject = '[Meritocracy] Please confirm your email';
                const html = `
                    <p>Hi ${firstName} ${lastName},</p>
                    <p>Thanks for your interest joining in Meritocracy. To user your email, we need to confirm your email address.</p>
                    <p>Please click <a href='${url}'>here</a> to verify your email.</p>
                    <p>This link will expire within 12 hours.</p>
                    <p>Thanks,<br/>Your friends at Meritocracy</p>
                `;

                // Send email
                await Common.sendEmail(email, subject, html);
                
                // Create notification
                const description = 'The verification email has been sent. Please verify your email in order to get full features access.';
                await Notification.create({ type: 1, userId, description });
            }
        }

        // Success;
        res.send({ success: true, message: 'Profile updated successfully' });;
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// Search users and clients on first page
router.post('/search', Common.verifyToken, async (req, res) => {
    try {
        const { id: myUserId } = req.authData;
        const {
            keyword,
            filter,
            clientFilter,
            userFilter,
            source,
            date,
            dateFrom,
            dateTo,
            joinDateFrom,
            joinDateTo,
            mpFrom,
            mpTo,
            client,
        } = req.body;
        
        let { userPageSize, userPageNum, clientPageSize, clientPageNum, } = req.body;
        
        userPageSize = userPageSize || 10;
        userPageNum = userPageNum || 1;
        let userOffset = (userPageNum - 1) * userPageSize;

        clientPageSize = clientPageSize || 10;
        clientPageNum = clientPageNum || 1;
        let clientOffset = (clientPageNum - 1) * clientPageSize;

        var userIdsSql = `
            SELECT
                id
            FROM Users
            WHERE (
                username LIKE '%${keyword}%' OR
                CONCAT(firstName, ' ', lastName) LIKE '%${keyword}%' OR
                id IN (SELECT userId FROM Emails WHERE email LIKE '%${keyword}%')
            )
        `;

        var clientSubSql = '', clientSubSql1 = '';
        if (clientFilter >= 0 || client) {
            userIdsSql += ` AND id IN (
                SELECT
                    a.userId
                FROM
                    MyClients a,
                    Clients b
                WHERE
                    a.clientId = b.id `;
            if (clientFilter == 0) {
                // legacy
                userIdsSql += `AND b.type = 0 `;
                clientSubSql += `AND a.type = 0 `;
            } else if (clientFilter == 1) {
                // certified
                userIdsSql += `AND b.type = 1 `;
                clientSubSql += `AND a.type = 1 `;
            } else if (clientFilter == 2) {
                // my organisations
                userIdsSql += `AND a.userId = '${myUserId}' `;
                clientSubSql1 += `AND a.userId = '${myUserId}' `;
            }

            if (client) {
                userIdsSql += `AND b.clientId = '${client}' `;
                clientSubSql += `AND a.clientId = '${client}' `;
            }
            userIdsSql += `) `;
        }

        // profile filter - 3: Users, 2: Moderators, 1: Admins, -1: All
        if (userFilter == 3) {
            // Users
            userIdsSql += `AND role >= 2 `;
        } else if (userFilter == 2) {
            // Moderators - Admin with restricted rights
            userIdsSql += `AND role = 1 `;
        } else if (userFilter == 1) {
            userIdsSql += `AND role <= 1 `;
        }

        // source filter - 0: You, 1: Your Friends, 2: Admins, -1: All
        if (source == 0) {
            // You
            userIdsSql += `AND id = '${myUserId}' `;
            clientSubSql += `AND a.ownerId = '${myUserId}' `;
            clientSubSql1 += `AND a.userId = '${myUserId}' `;
        } else if (source == 1) {
            // Your Friends
        } else if (source == 2) {
            // Admins
            userIdsSql += `AND role <= 1 `;
            clientSubSql += `AND b.role <= 1 `;
            clientSubSql1 += `AND b.role <= 1 `;
        }

        // date filter
        if (date > 0) {
            userIdsSql += `AND YEAR(createdAt) = ${date} `;
            clientSubSql += `AND YEAR(a.createdAt) = ${date} `;
        }
        if (dateFrom) {
            userIdsSql += `AND createdAt >= '${dateFrom}' `;
            clientSubSql += `AND a.createdAt >= '${dateFrom}' `;
        }
        if (dateTo) {
            userIdsSql += `AND createdAt <= '${dateTo}' `;
            clientSubSql += `AND a.createdAt <= '${dateTo}' `;
        }

        // join date range
        if (joinDateFrom || joinDateTo) {
            clientSubSql1 += `AND a.userId = '${myUserId}' `;
            if (joinDateFrom) {
                clientSubSql1 += `AND a.createdAt >= '${joinDateFrom}' `;
            }
            if (joinDateTo) {
                clientSubSql1 += `AND a.createdAt <= '${joinDateTo}' `;
            }
        }
        
        // merit point range
        if (mpFrom != null && mpFrom >= 0) {
            userIdsSql += `AND mpRating >= ${mpFrom} `;
        }
        if (mpTo != null && mpTo >= 0) {
            userIdsSql += `AND mpRating <= ${mpTo} `;
        }

        let userTotalSql = `SELECT COUNT(*) totalCount FROM (${userIdsSql}) a`;
        // userIdsSql += `ORDER BY firstname, lastname, id `;

        let clientIdsSql = `
            SELECT
                a.id
            FROM
                Clients a,
                Users b
            WHERE (
                a.creatorId = b.id OR
                a.ownerId = b.id
            ) ${clientSubSql} AND
                a.name LIKE '%${keyword}%' AND
                a.id IN (
                    SELECT
                        a.clientId
                    FROM
                        MyClients a,
                        Users b
                    WHERE
                        a.userId = b.id
                        ${clientSubSql1}
                )
        `;
        let clientTotalSql = `SELECT COUNT(*) totalCount FROM (${clientIdsSql}) a`;

        var data = {};
        if (filter != 1) {
            data.totalCount = await Common.querySelect(userTotalSql, undefined, true);

            if (data.totalCount / userPageNum > 500) {
                data.totalCount = userPageNum * 500;
            }
            if (data.totalCount <= userOffset) {
                userOffset = data.totalCount - clientPageSize;
            }
            if (userOffset < 0) {
                userOffset = 0;
            }
            userIdsSql += `LIMIT ${userOffset}, ${userPageSize}`;
            let userIds = await Common.querySelect(userIdsSql);
            let ids = `''`;
            userIds.forEach(obj => {
                ids += `, '${obj.id}'`;
            });
            let userSql = `
                SELECT
                    a.id, a.firstName, a.lastName, a.mpRating, COUNT(b.clientId) clientCount
                FROM Users a
                LEFT JOIN MyClients b ON a.id = b.userId
                WHERE a.id IN (${ids})
                GROUP BY a.id
                ORDER BY a.firstName, a.lastName, a.id
            `;
            data.users = await Common.querySelect(userSql);
        }
        if (filter != 0) {
            data.totalCount = await Common.querySelect(clientTotalSql, undefined, 1);
            if (data.totalCount / clientPageNum > 500) {
                data.totalCount = clientPageNum * 500;
            }
            if (data.totalCount <= clientOffset) {
                clientOffset = data.totalCount - clientPageSize;
            }
            if (clientOffset < 0) {
                clientOffset = 0;
            }
            clientIdsSql += `LIMIT ${clientOffset}, ${clientPageSize}`;
            let clientIds = await Common.querySelect(clientIdsSql);
            let ids = `''`;
            clientIds.forEach(obj => {
                ids += `, '${obj.id}'`;
            });
            let clientSql = `
                SELECT
                    a.*,
                    COUNT(b.userId) AS totalUsers,
                    SUM(IF (c.role <= 1, 1, 0)) AS adminCount,
                    SUM(IF (c.role > 1, 1, 0)) AS managerCount
                FROM Clients a
                LEFT JOIN MyClients b ON a.id = b.clientId
                LEFT JOIN Users c ON b.userId = c.id
                WHERE a.id IN (${ids})
                GROUP BY a.id
                ORDER BY a.name, a.createdAt
            `;
            data.clients = await Common.querySelect(clientSql);
        }
        data.searchFilters = req.body;

        // Success
        res.send({ success: true, data });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message, data: { searchFilters: req.body } });
    }
});

// Check user status
router.get('/check', Common.verifyToken, async (req, res) => {
    try {
        let user = req.authData;
        const { id: userId } = user;

        const emails = await Email.findAll({ userId });

        user.socialEmails = [];
        if (emails && emails.length > 0) {
            for (let { id: emailId } of emails) {
                const socialEmails = await Social.findAll({ emailId });
                user.socialEmails = [ ...user.socialEmails, ...socialEmails];
            }
        }

        const notifications = await Notification.findAll({ userId });
        
        user.meritPoint = user.mpRating;
        user.emails = emails;
        user.notifications = notifications;

        // get token lifespan
        const realm = await Keycloak.getRealm();
        user.accessTokenLifespan =  realm.accessTokenLifespan;

        res.send({ success: true, data: user });
    } catch(e) {
        res.send({ success: false, token: false, message: e.message });
    }
});

// router.post('/token/send', Common.verifyToken, (req, res) => {
//     const { amount, userId } = req.body;
//     const { id: fromUserId } = req.authData;
//     User.sendTokenFromTo(amount, fromUserId, userId).then(() => {
//         res.send({ success: true, message: 'Successfully sent' });
//     }).catch(err => {
//         res.send({ success: false, message: err.msg || 'Internal server error' });
//     });
// });

// router.get('/tips', Common.verifyToken, (req, res) => {
//     const { id: receiverId } = req.authData.id;
//     Tip.findAll({ receiverId }).then(data => {
//         res.send({ success: true, data });
//     }).catch(err => {
//         res.send({ success: false, message: 'Internal server error' });
//     });
// });

// Get user info for organisations
router.get('/org/userinfo', Common.verifyOrgToken, (req, res) => {
    res.send({ success: true, data: req.authData });
});

// Log out for organisations
router.get('/org/logout', Common.verifyOrgToken, async (req, res) => {
    try {
        const token = req.headers['x-token'];
        const { appkey: secret } = req.headers;
        const { accessToken, refreshToken } = jwt.verify(token, secret);

        // Log out from Keycloak
        await Keycloak.logout(accessToken, refreshToken);

        // Success
        res.send({ success: true, message: 'Logout success' });
    } catch(e) {
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;