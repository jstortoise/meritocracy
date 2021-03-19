const express = require('express');

const Common = require('../controllers/common');
const Email = require('../controllers/email');
const Keycloak = require('../controllers/keycloak');
const Notification = require('../controllers/notification');
const Score = require('../controllers/score');
const Social = require('../controllers/social');
const User = require('../controllers/user');
const Wallet = require('../controllers/wallet');

const router = express.Router();
const { ADMIN_GLX_FEE, ADMIN_ETH_FEE, ADMIN_BTC_FEE, ADMIN_BCH_FEE } = require('../config');

router.get('/me', Common.verifyToken, async (req, res) => {
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

        // Get wallet infor
        const glxWallet = await Wallet.findOne({ coinType: 0, userId });
        if (glxWallet) {
            user.glxAddress = glxWallet.address;
            user.glxBalance = glxWallet.balance;
        }

        let ethWallet = await Wallet.findOne({ coinType: 1, userId });
        if (ethWallet) {
            user.ethAddress = ethWallet.address;
            user.ethBalance = ethWallet.balance;
        }

        let btcWallet = await Wallet.findOne({ coinType: 2, userId });
        if (btcWallet) {
            user.btcAddress = btcWallet.address;
            user.btcBalance = btcWallet.balance;
        }

        let bchWallet = await Wallet.findOne({ coinType: 3, userId });
        if (bchWallet) {
            user.bchAddress = bchWallet.address;
            user.bchBalance = bchWallet.balance;
        }

        user = {
            ...user,
            glxFee: ADMIN_GLX_FEE,
            ethFee: ADMIN_ETH_FEE,
            btcFee: ADMIN_BTC_FEE,
            bchFee: ADMIN_BCH_FEE,
        };

        // Success
        res.send({ success: true, data: user });
    } catch (e) {
        // Failed
        res.send({ success: false, token: false, message: e.message });
    }
});

router.get('/:id/detail', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.params;

        let user = await User.findOne({ id: userId });
        if (!user) {
            res.send({ success: false, message: 'User not found' });
            return;
        }

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

        // Success
        res.send({ success: true, data: user });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.get('/:id/info', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ id });

        // Success
        res.send({ success: true, data: user });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/detail', Common.verifyToken, async (req, res) => {
    try {
        const { socialType, originId } = req.body;

        const socialEmail = await Social.findOne({ socialType, originId });
        if (!socialEmail) {
            res.send({ success: false, message: 'User not found' });
            return;
        }
        
        const { emailId } = socialEmail;

        const userEmail = await Email.findOne({ id: emailId });
        if (!userEmail) {
            res.send({ success: false, message: 'User not found' });
            return;
        }

        const { userId } = userEmail;
        let user = await User.findOne({ id: userId });
        if (!userEmail) {
            res.send({ success: false, message: 'User not found2' });
            return;
        }

        const emails = await Email.findAll({ userId });
        
        user.socialEmails = [];
        if (emails && emails.length > 0) {
            for (let { id } of emails) {
                const socialEmails = await Social.findAll({ emailId: id });
                user.socialEmails = [ ...user.socialEmails, ...socialEmails];
            }
        }

        const notifications = await Notification.findAll({ userId });

        user.meritPoint = user.mpRating;
        user.emails = emails;
        user.socialEmails = socialEmails;
        user.notifications = notifications;
        user.currentEmail = userEmail.email;
        
        // Success
        res.send({ success: true, data: user });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/list', Common.verifyToken, async (req, res) => {
    try {
        // search keyword
        const { keyword, sortBy, ascDesc, pageNum, pageSize } = req.body;
        
        let options = { raw: true };

        if (keyword) {
            options.where = { username: { $like: `%${keyword}%` } };
        }

        // sortby fields
        if (sortBy && ascDesc) {
            options.order = [[sortBy, ascDesc]];
        }

        // pagination info
        let offset = 0, limit = 10;
        if (pageNum && pageSize) {
            offset = (pageNum - 1) * pageSize;
            limit = offset + pageSize;
        }

        options = { ...options, offset, limit };
        
        const users = await User.findAllBy(options);

        // Success;
        res.send({ success: true, data: users });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/search', Common.verifyToken, async (req, res) => {
    try {
        const { users, totalCount } = await User.searchBy(req.body);
        // Success
        res.send({ success: true, data: users, totalCount });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.put('/create', Common.verifyToken, async (req, res) => {
    try {
        const { firstName, lastName, username, password, email, role } = req.body;
        let message = 'User created successfully', isValid = false;

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
        } else if (!role) {
            message = 'Role is empty';
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

        // Success
        res.send({ success: true, message });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.put('/:id/update', Common.verifyToken, async(req, res) => {
    try {
        const { id } = req.params;
        await User.update(req.body, { id });
        
        // Success
        res.send({ success: true, message: 'Updated successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.delete('/:id/delete', Common.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await User.remove({ id });

        // Success
        res.send({ success: true, message: 'Removed successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.get('/:userId/scores/:clientId', Common.verifyToken, async (req, res) => {
    try {
        const { userId, clientId } = req.params;
        const where = { userId, clientId };

        const scores = await Score.findAll(where);
        const total = scores ? scores.reduce((sum, score) => sum + score.value, 0) : 0;

        // Success
        res.send({ success: true, data: scores, total });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

// add test user data to db
router.get('/add/test/:letter', async (req, res) => {
    const { letter } = req.params;
    const { generateRandomString } = common;
    var appkey = '';
    for (let i = 0; i < 100000; i++) {
        try {
            let data = {
                id: generateRandomString(8) + '-' + generateRandomString(4) + '-' + generateRandomString(4) + '-' + generateRandomString(4) + '-' + generateRandomString(12),
                username: generateRandomString(5),
                password: "123",
                firstname: generateRandomString(5),
                lastname: generateRandomString(5),
                role: Math.floor(Math.random() * 3),
                private_key: "",
                public_key: "",
                mid: i
            };
            await User.addTestUser(data);
            if (i % 1000 == 0) {
                appkey = generateRandomString(8) + '-' + generateRandomString(4) + '-' + generateRandomString(4) + '-' + generateRandomString(4) + '-' + generateRandomString(12);
                let client_data = {
                    appkey,
                    client_id: generateRandomString(5),
                    type: Math.floor(Math.random() * 10) % 2,
                    protocol: 'openid-connect',
                    rooturl: '',
                    owner_id: data.id,
                    creator_id: data.id
                };
                await User.addTestClient(client_data);
            } else {
                await User.addTestMyClient({ user_id: data.id, client_appkey: appkey });
            }
        } catch (e) {
            console.log(e);
        }
    }
    res.send({ success: true, message: 'Success' });
});

module.exports = router;
