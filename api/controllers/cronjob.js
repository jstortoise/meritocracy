const BaseDetail = require('./baseDetail');
const BaseField = require('./baseField');
const Client = require('./client');
const Comment = require('./comment');
const MyClient = require('./myClient');
const Notification = require('./notification');
const Transaction = require('./transaction');
const User = require('./user');
const Wallet = require('./wallet');
const WalletAPI = require('../meritocracy-wallets-api');
const db = require('../models');

const { ADMIN_GLX_ADDRESS, ADMIN_ETH_ADDRESS, ADMIN_BTC_ADDRESS, ADMIN_BCH_ADDRESS } = require('../config');

/**
 * Get admin address of coin
 * @param {Number} coinType 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
 */
const getAdminAddress = (coinType = 0) => {
    if (coinType == 1) {
        return ADMIN_ETH_ADDRESS;
    } else if (coinType == 2) {
        return ADMIN_BTC_ADDRESS;
    } else if (coinType == 3) {
        return ADMIN_BCH_ADDRESS;
    } else {
        return ADMIN_GLX_ADDRESS;
    }
};

/**
 * Calculate Member Rating
 */
const calcMemberRating = async () => {
    try {
        let sql = `
            SELECT
                mc.id AS id,
                mc.mpRating AS mpRating,
                br1.value * br2.value * bd.value AS newMpRating
            FROM MyClients mc
            LEFT JOIN Clients c ON mc.clientId = c.id
            LEFT JOIN BaseFields br1 ON
                br1.baseType = 10 AND ((
                    br1.fieldFrom IS NOT NULL AND
                    br1.fieldTo IS NOT NULL AND
                    br1.fieldFrom <= c.meritPoint AND
                    br1.fieldTo > c.meritPoint
                ) OR (
                    br1.fieldFrom IS NULL AND
                    br1.fieldTo IS NOT NULL AND
                    br1.fieldTo > c.meritPoint
                ) OR (
                    br1.fieldFrom IS NOT NULL AND
                    br1.fieldTo IS NULL AND
                    br1.fieldFrom <= c.meritPoint
                ))
            LEFT JOIN BaseFields br2 ON
                br2.baseType = 20 AND ((
                    br2.fieldFrom IS NOT NULL AND
                    br2.fieldTo IS NOT NULL AND
                    br2.fieldFrom <= mc.testScore AND ((
                        br2.fieldTo = 100 AND br2.fieldTo >= mc.testScore
                    ) OR (
                        br2.fieldTo != 100 AND br2.fieldTo > mc.testScore
                    ))
                ) OR (
                    br2.fieldFrom IS NULL AND
                    br2.fieldTo IS NOT NULL AND
                    br2.fieldTo > mc.testScore
                ) OR (
                    br2.fieldFrom IS NOT NULL AND
                    br2.fieldTo IS NULL AND
                    br2.fieldFrom <= mc.testScore
                ))
            LEFT JOIN BaseDetails bd ON bd.baseType = 3 AND bd.code = 0
        `;

        const dataList = await db.querySelect(sql);
        for (const { id, newMpRating: mpRating } of dataList) {
            await MyClient.update({ mpRating }, { id });
        }

        sql = `
            SELECT
                a.id AS id,
                a.mpRating AS mpRating,
                b.totalMpRating AS totalMpRating
            FROM Users a
            LEFT JOIN (
                SELECT
                    userId, SUM(mpRating) totalMpRating
                FROM MyClients
                GROUP BY userId
            ) b ON a.id = b.userId
        `;

        const userList = await db.querySelect(sql);
        if (userList && userList.length > 0) {
            for (const { id, totalMpRating: mpRating } of userList) {
                await User.updateOnly({ mpRating }, { id });
            }
        }
    } catch (e) {
        console.log('calcMemberRating', e);
    }
};

/**
 * Calculate Member to Member Rating
 * @param {Array} ratings - Object array. e.g. [{ username: "test1", rating: 5 }, { username: "test2", rating: 4 }]
 * @param {String} clientId - id of organisation
 */
const calcM2MRating = async (ratings, clientId) => {
    try {
        let condition = { "$or": [] };
        ratings.forEach(obj => {
            condition['$or'].push({ username: obj.username });
        });

        // get users
        let userList = await User.findAll(condition);

        condition = { "$or": [] };
        userList.forEach(user => {
            condition['$or'].push({ userId: user.id });
            ratings.forEach(obj => {
                if (obj.username == user.username) {
                    obj.userId = user.id;
                }
                return obj;
            });
        });

        let myClientList = await MyClient.findAll({ $and: [{ clientId }, condition] });
        let baseFields = await BaseField.findAll();
        let { value: orgWeight } = await BaseDetail.findOne({ baseType: 3, code: 0 });

        for (let myClient of myClientList) {
            let m2mRating = 0;

            ratings.forEach(obj => {
                if (obj.userId == myClient.userId) {
                    m2mRating = obj.rating / 5 * 100;
                }
            });
            
            let originM2m = myClient.m2mRating;
            let originMp = myClient.mpRating + originM2m;
            
            let memberWeight = 0;
            let rateEvaluation = 0;
            
            // Get Rate evaluation and Member weight
            baseFields.forEach(obj => {
                if (obj.baseType == 12) {
                    if (((obj.fieldFrom && obj.fieldFrom <= originMp) || !obj.fieldFrom) &&
                        ((obj.fieldTo && obj.fieldTo > originMp) || !obj.fieldTo)) {
                        memberWeight = obj.value;
                    }
                } else if (obj.baseType == 22) {
                    if (((obj.fieldFrom && obj.fieldFrom <= m2mRating) || !obj.fieldFrom) &&
                        ((obj.fieldTo && obj.fieldTo >= m2mRating) || !obj.fieldTo)) {
                        rateEvaluation = obj.value;
                    }
                }
            });

            myClient.m2mRating += (memberWeight * rateEvaluation * orgWeight);
            myClient.m2mRating = myClient.m2mRating.toFixed(2);

            await MyClient.update(myClient, { id: myClient.id });
        }

        sql = `
            SELECT
                a.id AS id,
                a.m2mRating AS m2mRating,
                b.totalM2mRating AS totalM2mRating
            FROM Users a
            LEFT JOIN (
                SELECT
                    userId, SUM(m2mRating) totalM2mRating
                FROM MyClients
                GROUP BY userId
            ) b ON a.id = b.userId
        `;

        userList = await db.querySelect(sql);
        if (userList && userList.length > 0) {
            for (const { id, totalM2mRating: m2mRating } of userList) {
                await User.updateOnly({ m2mRating }, { id });
            }
        }
    } catch (e) {
        console.log('calcM2MRating', e);
    };
};

/**
 * Calculate current consistency of the organisation
 */
const calcConsistency = async () => {
    try {
        let myClientList = await MyClient.findAll();
        let { value: increase } = await BaseDetail.findOne({ baseType: 3, code: 1 });
        let { value: decrease } = await BaseDetail.findOne({ baseType: 3, code: 2 });

        for (let myClient of myClientList) {
            let { id, userId, clientId, isCommented } = myClient;
            let consistency = myClient.consistency > 100 ? myClient.consistency : 100;

            let currentComment = await Comment.getCurrentCommentBy(userId, clientId, 'hour');
            let prevComment = await Comment.getPrevCommentBy(userId, clientId, 'hour');

            if (isCommented == 1) {
                // Current comment calculated as consistency
                if (currentComment) continue;
                
                consistency -= increase;
                isCommented = 0;
            } else if (isCommented == 0) {
                // last comment calculated as consistency
                if (!currentComment) continue;
                
                consistency += increase;
                isCommented = 1;
            } else if (isCommented == -1) {
                // last comment not calculated yet
                if (prevComment) {
                    consistency += increase;
                } else {
                    consistency -= decrease;
                }
                isCommented = 0;
            }

            if (consistency > 200) {
                consistency = 200;
            } else if (consistency < 100) {
                consistency = 100;
            }

            // Update myclient table
            await MyClient.update({ isCommented, consistency }, { id });
        }
    } catch (e) {
        console.log('calcConsistency', e);
    }
};

/**
 * Calculate Organisation Merit Points
 */
const calcOrgMeritPoints = async () => {
    try {
        await calcConsistency();

        let clientList = await Client.findAll();;
        let myClientList = await MyClient.findAll();;
        let baseFields = await BaseField.findAll();

        if (!clientList || !myClientList) {
            return;
        }

        for (let client of clientList) {
            let totalNewPoint = 0;

            for (let myClient of myClientList) {
                let { clientId, userId, mpRating, m2mRating } = myClient;
                let mp = 0, totalScore = 0, meritPoint = 0, evaluation = 0, consistency = 0;

                if (!myClient.consistency) {
                    continue;
                }
        
                if (clientId == client.id) {
                    mp = mpRating + m2mRating;
                    
                    consistency = obj.consistency;
                    
                    // Get latest rating
                    let comment = await Comment.findOne({ clientId, userId });
                    if (comment) {
                        if (comment.rating) {
                            totalScore = comment.rating / 5 * 100;
                        }
                    }
                    
                    // get Merit Point range value and Evaluation
                    baseFields.forEach(field => {
                        if (field.baseType == 11) {
                            if (((field.fieldFrom && field.fieldFrom <= mp) || !field.fieldFrom) &&
                                ((field.fieldTo && field.fieldTo > mp) || !field.fieldTo)) {
                                meritPoint = field.value;
                            }
                        } else if (field.baseType == 21) {
                            if (((field.fieldFrom && field.fieldFrom <= totalScore) || !field.fieldFrom) &&
                                ((field.fieldTo && field.fieldTo >= totalScore) || !field.fieldTo)) {
                                evaluation = field.value;
                            }
                        }
                    });
                    
                    let newPoint = meritPoint * evaluation * consistency / 100;
                    totalNewPoint += newPoint;
                }
            }
            
            if (!client.meritPoint) {
                client.meritPoint = client.type == 1 ? 100 : 0;
            }
            if (!client.oldPoint) {
                client.oldPoint = 0;
            }

            client.meritPoint = client.meritPoint - client.oldPoint + totalNewPoint;
            client.oldPoint = totalNewPoint;

            // update client
            await Client.update({ meritPoint: client.meritPoint, oldPoint: client.oldPoint }, { id: client.id });
        }
    } catch (e) {
        console.log('calcOrgMeritPoints', e);
    }
};

/**
 * Check all balances of the users' wallet and manage balances to admin wallet
 */
const getCoinName = coinType => {
    if (coinType == 1) {
        return 'ETH';
    } else if (coinType == 2) {
        return 'BTC';
    } else if (coinType == 3) {
        return 'BCH';
    } else {
        return 'GLX';
    }
};
const checkWalletBalances = async () => {
    const wallets = await Wallet.findAll();

    if (wallets && wallets.length > 0) {
        for (let wallet of wallets) {
            try {
                const { address, privateKey, publicKey, balance, userId, coinType } = wallet;
                const balanceAmount = await WalletAPI.getBalance(coinType, address); // ETH or BTC but not Wei or Satoshi
                const adminAddress = getAdminAddress(coinType);

                if (!balanceAmount || balanceAmount <= 0) continue;
                
                console.log(`CoinType=${coinType}, Address=${address}, Amount=${balanceAmount}`);
                // Send transaction
                if (coinType == 2) {
                    continue;
                    await WalletAPI.sendTransaction(coinType, wallet, adminAddress, -1, 0);
                } else {
                    await WalletAPI.sendTransaction(coinType, wallet, adminAddress, balanceAmount, 0);
                }
                // Update balances on DB
                await Wallet.update({ balance: balance * 1 + balanceAmount * 1 }, { address, coinType });
                // Create notification
                await Notification.create({ type: 0, userId, description: `${balanceAmount} ${getCoinName(coinType)} is successfully deposited on your ETH address.` });
                // Create transaction history
                await Transaction.create({ coinType, txType: 1, from: '', to: address, value: balanceAmount, txFee: 0, description: 'Deposit' });
            } catch(e) {
                console.log(e);
            }
        }
    }
};

module.exports = {
    calcMemberRating,
    calcM2MRating,
    calcConsistency,
    calcOrgMeritPoints,
    checkWalletBalances,
}
