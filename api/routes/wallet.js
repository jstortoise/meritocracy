const express = require('express');

const WalletAPI = require('../meritocracy-wallets-api');
const BaseDetail = require('../controllers/baseDetail');
const Badge = require('../controllers/badge');
const Client = require('../controllers/client');
const Common = require('../controllers/common');
const Email = require('../controllers/email');
const Notification = require('../controllers/notification');
const Option = require('../controllers/option');
const Tip = require('../controllers/tip');
const Transaction = require('../controllers/transaction');
const Wallet = require('../controllers/wallet');

const router = express.Router();
const {
    ADMIN_GLX_FEE, ADMIN_ETH_FEE, ADMIN_BTC_FEE, ADMIN_BCH_FEE,
    ADMIN_GLX_ADDRESS, ADMIN_ETH_ADDRESS, ADMIN_BTC_ADDRESS, ADMIN_BCH_ADDRESS,
    ADMIN_GLX_PRIVATE_KEY, ADMIN_ETH_PRIVATE_KEY, ADMIN_BTC_PRIVATE_KEY, ADMIN_BCH_PRIVATE_KEY,
    ADMIN_GLX_PUBLIC_KEY, ADMIN_ETH_PUBLIC_KEY, ADMIN_BTC_PUBLIC_KEY, ADMIN_BCH_PUBLIC_KEY,
} = require('../config');

/**
 * 
 * @param {Number} coinType 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
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

/**
 * Get withdraw amount by considering fee
 * @param {Number} amount Amount of Coin
 * @param {Number} coinType 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
 */
const getWithdrawAmount = (amount, coinType = 0) => {
    if (coinType == 1) {
        return Common.subtractDecimals(amount, ADMIN_ETH_FEE);
    } else if (coinType == 2) {
        return Common.subtractDecimals(amount, ADMIN_BTC_FEE);
    } else if (coinType == 3) {
        return Common.subtractDecimals(amount, ADMIN_BCH_FEE);
    } else {
        return Common.subtractDecimals(amount, ADMIN_GLX_FEE);
    }
};

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
 * Get admin private key of coin
 * @param {Number} coinType 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
 */
const getAdminPrivateKey = (coinType = 0) => {
    if (coinType == 1) {
        return ADMIN_ETH_PRIVATE_KEY;
    } else if (coinType == 2) {
        return ADMIN_BTC_PRIVATE_KEY;
    } else if (coinType == 3) {
        return ADMIN_BCH_PRIVATE_KEY;
    } else {
        return ADMIN_GLX_PRIVATE_KEY;
    }
};

/**
 * Get admin public key of coin
 * @param {Number} coinType 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
 */
const getAdminPublicKey = (coinType = 0) => {
    if (coinType == 1) {
        return ADMIN_ETH_PUBLIC_KEY;
    } else if (coinType == 2) {
        return ADMIN_BTC_PUBLIC_KEY;
    } else if (coinType == 3) {
        return ADMIN_BCH_PUBLIC_KEY;
    } else {
        return ADMIN_GLX_PUBLIC_KEY;
    }
};

/**
 * Get admin fee of coin
 * @param {Number} coinType 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
 */
const getAdminFee = (coinType = 0) => {
    if (coinType == 1) {
        return ADMIN_ETH_FEE;
    } else if (coinType == 2) {
        return ADMIN_BTC_FEE;
    } else if (coinType == 3) {
        return ADMIN_BCH_FEE;
    } else {
        return ADMIN_GLX_FEE;
    }
};

/**
 * Generate Wallet Address
 * @param {Number} coinType - 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
 */
router.get('/:coinType/create', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const { coinType } = req.params;
        const verifiedEmail = await Email.findOne({ userId, isVerified: 1 });
        
        if (!verifiedEmail) {
            res.send({ success: false, message: 'You must verify your account to generate wallet' });
            return;
        }
        
        const wallet = await Wallet.findOne({ coinType, userId });
        const coinName = getCoinName(coinType);

        if (wallet) {
            res.send({ success: false, message: `Your ${coinName} address is already generated` });
            return;
        }

        const { address, privateKey, publicKey } = await WalletAPI.generateAddress(coinType);
        // Create on DB
        await Wallet.create({ coinType, address, privateKey, publicKey, userId });

        // Success
        res.send({ success: true, data: { address }, message: `Your ${coinName} wallet is generated successfully` });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

/**
 * Get balance
 * @param {Number} coinType - 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
 */
router.get('/:coinType/balance', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const { coinType } = req.params;
        const wallet = await Wallet.findOne({ coinType, userId });
        const coinName = getCoinName(coinType);

        if (!wallet) {
            res.send({ success: false, message: `You not have ${coinName} wallet` });
        } else {
            res.send({ success: true, data: { balance: wallet.balance } });
        }
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

/**
 * Withdraw
 * @param {Number} coinType - 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
 */
router.post('/:coinType/withdraw', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const { coinType } = req.params;
        const { address, amount } = req.body;
        const coinName = getCoinName(coinType);

        if (!address) {
            res.send({ success: false, message: 'Address undefined' });
            return;
        }

        const wallet = await Wallet.findOne({ coinType, userId });

        if (!wallet) {
            res.send({ success: false, message: `You don't have ${coinName} wallet` });
            return;
        } else if (wallet.balance < amount ) {
            res.send({ success: false, message: 'Not enough balance' });
            return;
        }
        
        const withdrawAmount = getWithdrawAmount(amount, coinType);
        const adminFee = getAdminFee(coinType);

        const fromObj = {
            address: getAdminAddress(coinType),
            privateKey: getAdminPrivateKey(coinType),
            publicKey: getAdminPublicKey(coinType)
        };

        // Send transaction
        await WalletAPI.sendTransaction(coinType, fromObj, address, amount, adminFee);
        // Update wallet on DB
        await Wallet.update({ balance: Common.subtractDecimals(wallet.balance, amount) }, { userId, coinType });
        // create transaction history
        await Transaction.create({ coinType, txType: 2, from: wallet.address, to: address, value: amount, txFee: adminFee, description: 'Withdraw' });
        // create notification
        await Notification.create({ type: 0, userId, description: `${withdrawAmount} is successfully withdrawn on your ${coinName} address (${address}).` });

        // Success
        res.send({ success: true, data: { balance: Common.subtractDecimals(wallet.balance, amount), amount: withdrawAmount }, message: 'Withdraw success' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

/**
 * Tip by coins
 * @param {Number} coinType - 0 = GLX(Default), 1 = ETH, 2 = BTC, 3 = BCH
 */
router.post('/tip/:coinType', Common.verifyToken, async (req, res) => {
    try {
        const { coinType } = req.params;
        const { clientId, amount } = req.body;
        const { id: senderId } = req.authData;
        const coinName = getCoinName(coinType);
    
        if (!amount || amount <= 0) {
            res.send({ success: false, message: 'Tip amount should be bigger than 0' });
            return;
        }
        
        const client = await Client.findOne({ id: clientId });
        if (!client) {
            res.send({ success: false, message: 'Unknown organisation' });
            return;
        }
        
        const receiverId = client.ownerId;
        if (receiverId == senderId) {
            res.send({ success: false, message: 'You cannot tip yourself' });
            return;
        }
        
        const senderWallet = await Wallet.findOne({ coinType, userId: senderId });
        if (!senderWallet) {
            res.send({ success: false, message: `You don't have ${coinName} wallet` });
            return;
        } else if (!senderWallet.balance || senderWallet.balance < amount) {
            res.send({ success: false, message: `Not enough ${coinName} balance on your account` });
            return;
        }

        const receiverWallet = await Wallet.findOne({ coinType, userId: receiverId });
        if (!receiverWallet) {
            res.send({ success: false, message: `The site owner doesn't have ${coinName} wallet` });
            return;
        }

        const tipOption = await Option.findOne({ type: 0, clientId, field: coinName.toLowerCase() });
        if (!tipOption) {
            res.send({ success: false, message: `The site owner not allowed tip with ${coinName}` });
            return;
        }

        // Token Amount Per Tip
        const { value: tokensPerTip } = await BaseDetail.findOne({ baseType: 4, code: 0 });
        // Tip Amount Accumulation
        const { value: tipAmountAccumulation } = await BaseDetail.findOne({ baseType: 4, code: 1 });

        let tokenAmount = amount;
        if (coinType == 0) {
            // Check basic setting
            if (!tokensPerTip || tokensPerTip <= 0 || !tipAmountAccumulation || tipAmountAccumulation <= 0) {
                res.send({ success: false, message: 'Something is wrong with basic settings. Please contact to admin and try again.' });
                return;
            }
            
            // Get token amount of GLX coin
            tokenAmount = amount * tokensPerTip;
        }

        // Update balance for sender
        await Wallet.update({ balance: senderWallet.balance - tokenAmount }, { address: senderWallet.address, coinType: coinType });
        // Update balance for receiver
        await Wallet.update({ balance: receiverWallet.balance * 1 + tokenAmount * 1 }, { address: receiverWallet.address, coinType: coinType });
        // create transaction history
        await Transaction.create({ coinType, txType: 0, from: senderWallet.address, to: receiverWallet.address, value: tokenAmount, txFee: 0, description: 'Tip' });
        // Send tip
        await Tip.create({ coinType, tipAmount: amount, tokenAmount, senderId, receiverId });
        // Create badge "Tipped for the first time"
        // await Badge.create({ userId: senderId, badgeType: 5 });
        // Create badge "Received a Tip first time"
        await Badge.create({ userId: receiverId, badgeType: 9 });
        // Create badge "Sent a ETH Tip"
        await Badge.create({ userId: senderId, badgeType: 10 + coinType * 1 });
        // Create badge "Received a ETH Tip"
        // await Badge.create({ userId: receiverId, badgeType: 20 + coinType * 1 });

        if (coinType == 0) {
            const tippedTokenAmount = await Tip.getTokenAmount(receiverId);
            if (tippedTokenAmount >= 100) {
                // Create badge "Received a Tip of more than 100 Tokens"
                await Badge.create({ userId: receiverId, badgeType: 7 });
            }

            const count = await Tip.count({ receiverId });
            if (count >= tipAmountAccumulation) {
                // Create badge "Tipped on amount accumulated"
                await Badge.create({ userId: receiverId, badgeType: 6 });
            }
        }

        // Success
        res.send({ success: true, message: `Successfully tipped with ${coinName}` });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;
