const bcrypt = require('bcryptjs');
const openpgp = require('openpgp');

const db = require('../models');
const Keycloak = require('./keycloak');

const { PGP_PASS_PHRASE, FACEBOOK_PREFIX, KC_MAIL_DOMAIN } = require('../config');

// Common functions
const findAll = where => db.User.findAll({ where, raw: true });
const findAllBy = options => db.User.findAll({ ...options, raw: true });
const findOne = where => db.User.findOne({ where, raw: true });
const count = where => db.User.count({ where });

/**
 * Create user for Meritocracy or organisations if appkey is valid.
 * @param {Object} data User information: { username, password, email, firstName, lastName }
 * @param {String} appkey Organisation's APP_KEY
 */
const create = async data => {
    const { username, password, firstName, lastName, email, role } = data;
    // Register on keycloak
    const { id } = await Keycloak.createUser(data);

    // Generate mid
    const options = {
        userIds: [{ username }],
        curve: "ed25519",
        passphrase: PGP_PASS_PHRASE
    };
    const { privateKeyArmored: privateKey, publicKeyArmored: publicKey } = await openpgp.generateKey(options); // publick_key = key.publicKeyArmored
    const pgpRes = await openpgp.key.readArmored(publicKey); // get mid
    const mid = pgpRes.keys[0].primaryKey.getKeyId().toHex();

    // generate new user data
    const user = { id, username, password, firstName, lastName, mid, privateKey, publicKey, role, status: 1 };
    await db.User.create(user);

    // add email
    await db.Email.create({ email, isPrimary: 1, userId: id });

    return { ...user, email };
};

/**
 * Create user with Facebook information
 * @param {Object} data User information. { email, facebookId, firstName, lastName, role }
 */
const createWithFacebook = async (data, clientId = null) => {
    const { email, facebookId, firstName, lastName, role } = data;
    
    // Create new primary user on Keycloak
    const { id: userId } = await Keycloak.createUser({
        username: email,
        password: facebookId,
        email,
        firstName,
        lastName
    });
    
    // Add social user on Keycloak
    const { id: keycloakId } = await Keycloak.createUser({
        username: FACEBOOK_PREFIX + facebookId,
        password: facebookId,
        email: FACEBOOK_PREFIX + facebookId + KC_MAIL_DOMAIN,
        firstName: firstName,
        lastName: lastName
    });

    // Generate mid
    const options = {
        userIds: [{ username: email }],
        curve: "ed25519",
        passphrase: PGP_PASS_PHRASE
    };
    const { privateKeyArmored: privateKey, publicKeyArmored: publicKey } = await openpgp.generateKey(options); // publick_key = key.publicKeyArmored
    const pgpRes = await openpgp.key.readArmored(publicKey); // get mid
    const mid = pgpRes.keys[0].primaryKey.getKeyId().toHex();
    
    // Create user on DB
    await db.User.create({
        id: userId,
        username: email,
        password: facebookId,
        firstName, lastName, mid, privateKey, publicKey, status: 1, role
    });
    
    // Create user info in myclients table on DB
    if (clientId) {
        // Check if user is member of the client
        const myClient = await db.MyClient.findOne({ where: { userId, clientId }, raw: true });
        if (myClient) {
            // Update login_date
            await db.MyClient.update({ userId }, { where: { id: myClient.id } });
        } else {
            // Create myclient
            await db.MyClient.create({ userId, clientId });
        }
    }
    
    // Create new email on DB
    const { id: emailId } = await db.Email.create({ email, userId, isActive: 1, isPrimary: 1, isVerified: 1 });
    
    // Create new social email on DB
    await db.Social.create({ emailId, socialType: 2, socialId: facebookId, keycloakId });

    // suspend other emails
    await db.Email.update({ isActive: 0 }, { where: { email, userId: { $ne: userId } } });

    const client = await db.Client.findOne({ where: { id: clientId }, raw: true });
    // Get login token from Keycloak
    const tokens = await Keycloak.login(FACEBOOK_PREFIX + facebookId, facebookId, client);

    // Success
    return tokens;
    // return { userId, tokens };
};

/**
 * Update user with Facebook information
 * @param {Object} data User information. { userId, email, facebookId, firstName, lastName }
 */
const updateWithFacebook = async (data, clientId = null) => {
    const { userId, emailId, email, facebookId, firstName, lastName } = data;

    // Add social user on Keycloak
    const { id: keycloakId } = await Keycloak.createUser({
        username: FACEBOOK_PREFIX + facebookId,
        password: facebookId,
        email: FACEBOOK_PREFIX + facebookId + KC_MAIL_DOMAIN,
        firstName,
        lastName
    });

    // Create social email on DB
    await db.Social.create({ emailId, socialType: 2, socialId: facebookId, keycloakId });

    // Suspend other emails
    await db.Email.update({ isActive: 0 }, { where: { email, userId: { $ne: userId } } });

    // Suspend other emails
    await db.Email.update({ isActive: 1, isVerified: 1 }, { where: { id: emailId } });

    // Create user info in myclients table on DB
    if (clientId) {
        // Check if user is member of the client
        const myClient = await db.MyClient.findOne({ where: { userId, clientId }, raw: true });
        if (myClient) {
            // Update login_date
            await db.MyClient.update({ userId }, { where: { id: myClient.id } });
        } else {
            // Create myclient
            await db.MyClient.create({ userId, clientId });
        }
    }

    const client = await db.Client.findOne({ where: { id: clientId }, raw: true });

    // Get login token from Keycloak
    const tokens = await Keycloak.login(FACEBOOK_PREFIX + facebookId, facebookId, client);

    // Success
    return tokens;
};

const login = async (username, password, secret = null) => {
    const sql = `
        SELECT
            a.*,
            b.email,
            b.isVerified,
            b.isActive,
            b.isPrimary
        FROM Users a
        LEFT JOIN Emails b ON a.id = b.userId
        WHERE (
            (a.username = $1 OR a.mid = $1) AND
            b.isPrimary = 1
        ) OR (
            b.email = $1 AND
            b.isVerified = 1
        )
    `;
    const users = await db.querySelect(sql, [ username ]);
    if (users.length == 0 || !users) {
        throw { message: 'User not found' };
    }

    let user = null;
    for (user of users) {
        if (await bcrypt.compare(password, user.password)) {
            break;
        }
    }

    // Check user
    if (!user) {
        throw { message: 'Incorrect password' };
    } else if (secret && !user.isVerified) {
        throw { message: 'Cannot login with unverified user' };
    }

    // Check if client login
    if (secret) {
        // check if client exists
        const client = await db.Client.findOne({ where: { secret }, raw: true });
        if (!client) {
            throw { message: 'Organisation not registered' };
        }

        // check if user is member of the client
        const myClient = await db.MyClient.findOne({ where: { userId: user.id, clientId: client.id }, raw: true });
        if (myClient) {
            // update login_date
            await db.MyClient.update({ userId: user.id }, { where: { id: myClient.id } });
        } else {
            // create myclient
            await db.MyClient.create({ userId: user.id, clientId: client.id });
        }

        // Get tokens from Keycloak
        var tokens = await Keycloak.login(username, password, client);
    } else {
        var tokens = await Keycloak.login(username, password);
    }

    return tokens;
};

/**
 * Update user information on DB and Keycloak.
 * @param {Object} data User information to udpate
 * @param {Object} where Where condition
 */
const update = async (data, where) => {
    await Keycloak.updateUser(data, where);
    return db.User.update(data, { where });
};

/**
 * Update user information only on DB
 * @param {Object} data 
 * @param {Object} where 
 */
const updateOnly = async (data, where) => {
    return db.User.update(data, { where });
};

/**
 * Remove user from DB and Keycloak
 * @param {Object} where Where condition. e.g. { id: userId }
 */
const remove = async where => {
    const t = await db.sequelize.transaction();
    
    try {
        await db.User.destroy({ where, transaction: t });
        await Keycloak.removeUser(where);
        t.commit();
    } catch(e) {
        t.rollback();
        throw e;
    }

    return true;
};

const searchBy = async options => {
    let whereSql = `WHERE 1 = 1`;

    let bind = [], index = 0;
    const { keyword } = options;

    if (keyword) {
        index++;
        whereSql += ` AND (
            a.username LIKE $${index} OR
            CONCAT(a.firstName, ' ', a.lastName) LIKE $${index} OR
            d.email LIKE $${index}
        )`;
        bind.push(`%${keyword}%`);
    }

    const { tags } = options;
    if (tags) {
        if (tags.length > 0) {
            let subSql = `1 = 0`;

            for (let tag of tags) {
                index++;
                subSql += ` OR (
                    a.username LIKE $${index} OR
                    CONCAT(a.firstName, ' ', a.lastName) LIKE $${index} OR
                    d.email LIKE $${index}
                )`;
                bind.push(`%${tag}%`);
            }
            whereSql += ` AND (${subSql})`;
        }
    }

    let countSql = `
        SELECT
            COUNT(*) AS totalCount
        FROM Users a
        LEFT JOIN Emails d ON a.id = d.userId
        ${whereSql}
    `;

    whereSql += ` GROUP BY a.id`;

    const { sortBy, ascDesc } = options;
    if (sortBy && ascDesc) {
        whereSql += ` ORDER BY ${sortBy} ${ascDesc}`;
    }

    const { pageNum, pageSize } = options;
    if (pageNum > 0 && pageSize > 0) {
        const offset = (pageNum - 1) * pageSize;
        whereSql += ` LIMIT ${offset}, ${pageSize}`;
    }

    let sql = `
        SELECT
            a.*
        FROM Users a
        LEFT JOIN Emails d ON a.id = d.userId
        ${whereSql}
    `;
    
    let users = await db.querySelect(sql, bind);
    if (users && users.length > 0) {
        for (let user of users) {
            let clientSql = `
                SELECT
                    a.*,
                    b.name
                FROM MyClients a
                LEFT JOIN Clients b ON a.clientId = b.id
                WHERE
                    a.userId = '${user.id}'
                ORDER BY a.mpRating
            `;
            user.clients = await db.querySelect(clientSql);
        }
    }
    const totalCount = await db.querySelect(countSql, bind, true);
    
    return { users, totalCount };
};

const addTestUser = data => db.User.create(data);
const addTestEmail = data => db.Email.create(data);
const addTestClient = data => db.Client.create(data);
const addTestMyClient = data => db.MyClient.create(data);

// const sendTokenFromTo = (token_amount, from_user, to_user) => {
//     return new Promise((resolve, reject) => {
//         if (token_amount <= 0) {
//             reject({ msg: 'Token amount must be bigger than 0' });
//         } else {
//             db.User.findOne({ where: { id: from_user }, raw: true }).then(from => {
//                 if (!from) {
//                     reject({ msg: `${from_user} not exist` });
//                 } else {
//                     if (from.token_amount < token_amount) {
//                         reject({ msg: 'You don\'t have enough token' });
//                     } else {
//                         db.User.findOne({ where: { mid: to_user }, raw: true }).then(to => {
//                             if (!to) {
//                                 reject({ msg: `${to_user} not exist` });
//                             } else {
//                                 db.sequelize.transaction().then(t => {
//                                     db.User.update({
//                                         token_amount: from.token_amount - token_amount
//                                     }, {
//                                         where: { id: from_user },
//                                         transaction: t
//                                     }).then(() => {
//                                         db.User.update({
//                                             token_amount: to.token_amount + token_amount
//                                         }, {
//                                             where: { mid: to_user },
//                                             transaction: t
//                                         }).then(() => {
//                                             t.commit();
//                                             resolve(true);
//                                         }).catch(err => {
//                                             t.rollback();
//                                             reject(err);
//                                         });
//                                     }).catch(err => {
//                                         t.rollback();
//                                         reject(err);
//                                     });
//                                 }).catch(reject);
//                             }
//                         }).catch(reject);
//                     }
//                 }
//             }).catch(reject);
//         }
//     });
// };

module.exports = {
    findAll,
    findAllBy,
    findOne,
    count,
    create, 
    update,
    updateOnly,
    remove,
    login,
    createWithFacebook,
    updateWithFacebook,
    searchBy,
    // sendTokenFromTo,
    // addTestUser, addTestEmail, addTestClient, addTestMyClient,
};