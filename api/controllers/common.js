const FB = require('fb');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const db = require('../models');
const Keycloak = require('./keycloak');

const {
    MAIL_SERVICE,
    MAIL_USER,
    MAIL_PASSWORD,
    MAIL_FROM,
    FACEBOOK_PREFIX,
    KC_CLIENT_SECRET,
    FRONT_END_URL
} = require('../config');

const transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
});

const fbLogin = async (req, res, next) => {
    try {
        const { fbToken } = req.body;

        if (fbToken === undefined) {
            next();
            return;
        }

        if (!fbToken) {
            res.send({ success: false, message: 'Facebook authentication failed' });
            return;
        }
        
        const data = await FB.api('me', { fields: ['id', 'email'], access_token: fbToken });
        const { email, id: facebookId } = data;
        
        // Check if email exists
        const userEmail = await db.Email.findOne({ where: { email, isVerified: 1 }, raw: true });
        if (!userEmail) {
            res.send({ success: false, message: 'User not found' });
            return;
        }

        // Check if social email exists
        const { id: emailId, userId } = userEmail;
        const socialEmail = await db.Social.findOne({ where: { emailId, socialType: 2, socialId: facebookId }, raw: true });
        if (!socialEmail) {
            res.send({ success: false, message: 'User not found' });
            return;
        }
        
        // Check if user exists
        const user = await db.User.findOne({ where: { id: userId }, raw: true });
        if (!user) {
            res.send({ success: false, message: 'User not found' });
            return;
        }
        
        const tokens = await Keycloak.login(FACEBOOK_PREFIX + facebookId, facebookId);
        
        // success
        const token = generateToken(tokens);
        res.send({ success: true, data: { email, token } });
    } catch(e) {
        res.send({ success: false, message: 'Internal server error' });
    }
};

const fbOrgLogin = async (req, res, next) => {
    try {
        const { appkey: secret } = req.headers;
        const { fbToken } = req.body;
    
        // Check organisation
        let client = req.authData;
        if (!client) {
            if (!secret) {
                res.send({ success: false, message: 'Unknown organisation' });
                return;
            }

            // Get client info
            client = await db.Client.findOne({ where: { secret }, raw: true });
        }

        if (fbToken === undefined) {
            next();
            return;
        }

        if (!fbToken) {
            res.send({ success: false, message: 'Facebook authentication failed' });
            return;
        }

        const data = await FB.api('me', { fields: ['id', 'email'], access_token: fbToken });
        const { email, id: facebookId } = data;
        
        // Check if email exists
        const userEmail = await db.Email.findOne({ where: { email, isVerified: 1 }, raw: true });
        if (!userEmail) {
            res.send({ success: false, message: 'User not found' });
            return;
        }

        // Check if social email exists
        const { id: emailId, userId } = userEmail;
        const socialEmail = await db.Social.findOne({ where: { emailId, socialType: 2, socialId: facebookId }, raw: true });
        if (!socialEmail) {
            res.send({ success: false, message: 'User not found' });
            return;
        }

        // Check if user exists
        const user = await db.User.findOne({ where: { id: userId }, raw: true });
        if (!user) {
            res.send({ success: false, message: 'User not found' });
            return;
        }
        
        const tokens = await Keycloak.login(FACEBOOK_PREFIX + facebookId, facebookId, client);
        
        // Update myclient table when login
        const myClient = await db.MyClient.findOne({ where: { userId, clientId: client.id }, raw: true });
        if (myClient) {
            await db.MyClient.update({ userId }, { where: { id: myClient.id } });
        } else {
            await db.MyClient.create({ userId, clientId: client.id });
        }

        const token = generateToken(tokens, secret);

        // Success
        res.send({ success: true, data: { email, token } });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
};

// check token valid
const checkToken = async (token, client = null) => {
    let newToken = token;
    if (typeof token !== 'undefined') {
        let data = jwt.verify(token, client ? client.secret : KC_CLIENT_SECRET);
        let { accessToken, refreshToken } = data;

        // check if accessToken is valid
        let result = null;
        try {
            result = await Keycloak.getUserInfo(accessToken);
        } catch (e) {}

        if (!result) {
            // refresh token
            const data = await Keycloak.getRefreshToken(refreshToken, client);
            accessToken = data.access_token;
            newToken = generateToken({ accessToken, refreshToken: data.refresh_token }, client ? client.secret : KC_CLIENT_SECRET);
            // success
            result = await Keycloak.getUserInfo(accessToken);
            Keycloak.setAccessToken(accessToken);
        }
        
        let { email: currentEmail, sub: keycloakId } = result;

        // accessToken valid
        const socialEmail = await db.Social.findOne({ where: { keycloakId }, raw: true });
        
        let userId = keycloakId;
        if (socialEmail) {
            // Get userId
            const userEmail = await db.Email.findOne({ where: { id: socialEmail.emailId } });
            currentEmail = userEmail.email;
            userId = userEmail.userId;
        }

        let user = await db.User.findOne({ where: { id: userId }, raw: true });
        if (!user) {
            throw { message: 'User not found' };
        }
        user.currentEmail = currentEmail;

        return { user, token: newToken };
    } else {
        throw { message: 'Token undefined' };
    }
};

// Verify token
// FORMAT of token
// x-token: <access_token>
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-token'];
        const { user, token: newToken } = await checkToken(token);
        res.set('Access-Control-Expose-Headers', 'x-refresh-token');
        res.set('x-refresh-token', newToken);
        req.authData = user;
        next();
    } catch(e) {
        // Failed
        res.send({ success: false, token: false, message: e.message });
    }
};

// Verify org token
const verifyOrgToken = async (req, res, next) => {
    try {
        const token = req.headers['x-token'];
        const { appkey: secret } = req.headers;

        const client = await db.Client.findOne({ where: { secret }, raw: true });
        if (!client) {
            res.send({ success: false, message: 'Unknown organisation' });
            return;
        }
        
        const { user, token: newToken } = await checkToken(token, client);
        res.set('Access-Control-Expose-Headers', 'x-refresh-token');
        res.set('x-refresh-token', newToken);

        user.client = client;
        req.authData = user;
        next();
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
};

const verifyClient = async (req, res, next) => {
    try {
        const rootUrl = getDomain(req.headers.referer);
        const secret = req.params.secret || req.headers['appkey'];

        if (rootUrl == FRONT_END_URL) {
            next();
        } else {
            const client = await db.Client.findOne({ where: { secret, rootUrl }, raw: true });
            if (!client) {
                res.send({ success: false, message: 'Unknown organisation' });
            } else {
                req.authData = client;
                next();
            }
        }
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
};

const verifyCertSecret = async (req, res, next) => {
    try {
        const { appkey: secret } = req.headers;
        const client = await db.Client.findOne({ where: { secret, type: 1 }, raw: true });
        if (!client) {
            res.send({ success: false, message: 'Unknown organisation' });
        } else {
            req.authData = client;
            next();
        }
    } catch(e) {
        res.send({ success: false, message: e.message });
    }
};

const verifyLegacySecret = async (req, res, next) => {
    try {
        const { appkey: secret } = req.headers;
        const client = await db.Client.findOne({ where: { secret, type: 0 }, raw: true });
        if (!client) {
            res.send({ success: false, message: 'Unknown organisation' });
        } else {
            req.authData = client;
            next();
        }
    } catch(e) {
        res.send({ success: false, message: e.message });
    }
};

const generateToken = (tokens, secret = null) => {
    const token = jwt.sign(tokens, secret || KC_CLIENT_SECRET);
    return token;
};

const getDomain = (url = '') => {
    try {
        if (url) {
            url += '';
            url = url.replace('//', '**');
            url = url.split('/')[0].replace('**', '//');
        }
    } catch (e) {}
    return url;
};

const getDateText = date => {
    return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
};

const generateRandomString = length => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
     
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return text;
};

const checkURLValid = url => {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('ftp://'))) {
        return false;
    } else {
        return true;
    }
};

Number.prototype.countDecimals = function () {
    try {
        if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
        return this.toString().split(".")[1].length || 0;
    } catch(e) {
        return 0;
    }
}

const subtractDecimals = (first, second) => {
    let len = parseFloat(first).countDecimals();
    if (parseFloat(second).countDecimals() > len) {
        len = parseFloat(second).countDecimals();
    }

    return (first - second).toFixed(len);
};

/**
 * Send email
 * @param {String} to Email address to send
 * @param {String} subject Email subject
 * @param {String} html Email body as html
 */
const sendEmail = (to, subject, html) => {
    const mailOptions = { from: MAIL_FROM, to, subject, html };
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
};

const querySelect = (sql, bind = [], plain = false) => {
    return db.sequelize.query(sql, { bind, type: db.Sequelize.QueryTypes.SELECT, raw: true, plain });
};

const queryUpdate = (sql, bind = []) => {
    return db.sequelize.query(sql, { bind });
};

module.exports = {
    fbLogin, fbOrgLogin,
    checkToken,
    verifyToken, verifyOrgToken,
    verifyCertSecret, verifyLegacySecret,
    verifyClient,
    getDateText,
    getDomain,
    generateToken,
    generateRandomString,
    checkURLValid,
    subtractDecimals,
    sendEmail,
    querySelect, queryUpdate
};