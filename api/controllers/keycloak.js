const request = require('request');
const querystring = require('querystring');
const KcAdminClient = require('keycloak-admin').default;
const {
    KC_BASE_URL,
    KC_REALM_NAME,
    KC_ADMIN_LOGIN,
    KC_ADMIN_PASSWORD,
    KC_ADMIN_CLIENT_ID,
    KC_ADMIN_CLIENT_SECRET,
    KC_CLIENT_ID,
    KC_CLIENT_SECRET
} = require('../config');

const kcClient = new KcAdminClient({
    baseUrl: KC_BASE_URL,
    realmName: KC_REALM_NAME
});

const kcAdmin = new KcAdminClient({
    baseUrl: KC_BASE_URL,
    realmName: KC_REALM_NAME
});

/**
 * Send GET ajax request
 * @param {String} url Request URL
 * @param {Object} headers Request headers
 */
const sendGet = (url, headers = undefined) => {
    return new Promise((resolve, reject) => {
        request.get({
            json: true, url, headers
        }, (err, response, body) => {
            try {
                if (err) {
                    reject(err);
                } else if (body.error) {
                    reject(body.error);
                } else {
                    resolve(body);
                }
            } catch (e) {
                reject(e);
            }
        });
    });
};

/**
 * Send POST ajax request
 * @param {String} url Request URL
 * @param {Object} headers Request headers
 * @param {Object} body Request body
 */
const sendPost = (url, headers = undefined, body) => {
    return new Promise((resolve, reject) => {
        request.get({
            json: true, url, headers, body
        }, (err, response, body) => {
            try {
                if (err) {
                    reject(err);
                } else if (body) {
                    if (body.error) {
                        reject(body.error);
                    } else {
                        resolve(body);
                    }
                } else {
                    resolve(true);
                }
            } catch (e) {
                reject(e);
            }
        });
    });
};

/**
 * Check admin session status. Return true if active. If inactive, authenticate again and return true.
 */
const checkAdminAuth = async () => {
    const accessToken = kcAdmin.getAccessToken();

    try {
        await getUserInfo(accessToken);
    } catch(e) {
        const option = {
            username: KC_ADMIN_LOGIN,
            password: KC_ADMIN_PASSWORD,
            grantType: 'password',
            clientId: KC_ADMIN_CLIENT_ID,
            clientSecret: KC_ADMIN_CLIENT_SECRET
        };
    
        await kcAdmin.auth(option);
    }

    return true;
};

/**
 * Check authenticate for the specific client.
 * @param {String} username 
 * @param {String} password 
 * @param {Object} client { name, secret } Default = null, If valid, authenticate on the client's
 */
const login = async (username, password, client = null) => {
    const option = {
        username,
        password,
        grantType: 'password',
        clientId: client ? client.name : KC_CLIENT_ID,
        clientSecret: client ? client.secret : KC_CLIENT_SECRET
    };

    // Authenticate
    await kcClient.auth(option);
    
    // Get tokens
    const tokens = getTokens();

    return tokens;
};

/**
 * Logout from keycloak
 * @param {String} accessToken 
 * @param {String} refreshToken 
 */
const logout = async (accessToken, refreshToken) => {
    const url = `${KC_BASE_URL}/realms/${KC_REALM_NAME}/protocol/openid-connect/logout`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = querystring.stringify({
        client_id: KC_CLIENT_ID,
        client_secret: KC_CLIENT_SECRET,
        refresh_token: refreshToken
    });
    
    // Send logout request
    return sendPost(url, headers, body);
};

/**
 * Reset user password on Keycloak
 * @param {String} userId User id to reset password
 * @param {String} newPassword New password to reset
 */
const resetPassword = async (userId, newPassword) => {
    // Check admin auth
    await checkAdminAuth();
    
    // Reset password
    const option = {
        id: userId,
        credential: {
            value: newPassword,
            type: 'password',
            temporary: false
        }
    };

    return kcAdmin.users.resetPassword(option);
};

/**
 * Set accessToken
 * @param {String} accessToken 
 */
const setAccessToken = accessToken => {
    kcClient.setAccessToken(accessToken);
};

/**
 * Return accessToken and refreshToken
 */
const getTokens = () => {
    return {
        accessToken: kcClient.getAccessToken(),
        refreshToken: kcClient.refreshToken
    };
};

/**
 * Get new refreshToken
 * @param {String} refreshToken 
 * @param {Object} client 
 */
const getRefreshToken = async (refreshToken, client = null) => {
    const url = `${KC_BASE_URL}/realms/${KC_REALM_NAME}/protocol/openid-connect/token`;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = querystring.stringify({
        grant_type: 'refresh_token',
        client_id: client ? client.name : KC_CLIENT_ID,
        client_secret: client ? client.secret : KC_CLIENT_SECRET,
        refresh_token: refreshToken
    });

    return sendPost(url, headers, body);
};

/**
 * 
 * @param {Object} data User information. { username, password, email, firstName, lastName }
 */
const createUser = async data => {
    const { username, password, email, firstName, lastName } = data;

    // Check admin auth
    await checkAdminAuth();

    // Create user
    const userData = {
        username,
        email,
        firstName,
        lastName,
        realm: KC_REALM_NAME,
        enabled: true,
        credentials: [{
            temporary: false,
            type: 'password',
            value: password
        }]
    };

    return kcAdmin.users.create(userData);
};

/**
 * 
 * @param {Object} data User data. e.g. { username, email, firstName, lastName, emailVerified }
 * @param {Object} where Where condition. e.g. { id: userId }
 */
const updateUser = async (data, where) => {
    // Check admin auth
    await checkAdminAuth();
    
    return kcAdmin.users.update(where, data);
};

/**
 * Remove user from Keycloak
 * @param {Object} where Where condition. e.g. { id: userId }
 */
const removeUser = async where => {
    // Check admin auth
    await checkAdminAuth();

    return kcAdmin.users.del(where);
};

/**
 * Get user info from accessToken
 * @param {String} accessToken 
 */
const getUserInfo = async accessToken => {
    const url = `${KC_BASE_URL}/realms/${KC_REALM_NAME}/protocol/openid-connect/userinfo`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    return sendGet(url, headers);
};

/**
 * Create new client on Keycloak
 * @param {Object} data Client information. e.g. { name, rootUrl }
 */
const createClient = async data => {
    await checkAdminAuth();
    const { name: clientId, rootUrl } = data;
    const clientData = {
        clientId,
        rootUrl,
        enabled: true,
        protocol: 'openid-connect'
    };
    return kcAdmin.clients.create(clientData);
};

/**
 * Update client on Keycloak
 * @param {Object} data Update data
 * @param {Object} where Where condition to update. e.g. { id: secret }
 */
const updateClient = async (data, where) => {
    await checkAdminAuth();
    return kcAdmin.clients.update(where, data);
};

/**
 * Remove client from Keycloak
 * @param {Object} where Where condition to remove. e.g. { id: secret }
 */
const removeClient = async where => {
    await checkAdminAuth()
    
    return kcAdmin.clients.del(where);
};

/**
 * Get sessions of the client on Keycloak
 * @param {String} clientId
 */
const getClientSessions = async clientId => {
    await checkAdminAuth();
    
    const url = `${KC_BASE_URL}/${KC_ADMIN_LOGIN}/realms/${KC_REALM_NAME}/clients/${clientId}/user-sessions`;
    const accessToken = kcAdmin.getAccessToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };
    
    return sendGet(url, headers);
};

/**
 * Update realm settings
 * @param {Object} data 
 */
const updateRealm = async data => {
    await checkAdminAuth();
    return kcAdmin.realms.update({ realm: 'master' }, data);
};

/**
 * Get realm settings
 * @param {String} realm 
 */
const getRealm = async (realm = 'master') => {
    await checkAdminAuth();
    return kcAdmin.realms.findOne({ realm });
};

module.exports = {
    login, logout, resetPassword,
    setAccessToken, getTokens, getRefreshToken,
    createUser, updateUser, removeUser, getUserInfo,
    createClient, updateClient, removeClient, getClientSessions,
    getRealm, updateRealm,
};