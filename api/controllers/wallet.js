const db = require('../models');

const findAll = where => db.Wallet.findAll({ where, raw: true });
const findOne = where => db.Wallet.findOne({ where, raw: true });
const create = data => db.Wallet.create(data);
const update = (data, where) => db.Wallet.update(data, { where });

/**
 * Send transaction from_address to to_address
 * @param {String} fromAddress - Address of sender
 * @param {String} toAddress - Address of receiver
 * @param {Number} amount - Amount of coin
 * @param {Number} coinType - 0: GLX(Default), 1: ETH, 2: BTC, 3: BCH
 */
const sendTransaction = async (fromAddress, toAddress, amount, coinType = 1) => {
    const fromAccount = await db.Wallet.findOne({ where: { address: fromAddress, coinType }, raw: true });
    const toAccount = await db.Wallet.findOne({ where: { address: toAddress, coinType }, raw: true });
    if (!fromAccount || toAccount) {
        throw { msg: 'Cannot find user or wallet' };
    } else if (fromAccount.balance < amount) {
        throw { msg: 'You don\'t have enough balance' };
    } else {
        const t = await db.sequelize.transaction();
        try {
            await db.Wallet.update({ balance: fromAccount.balance - amount }, { where: { address: fromAddress, coinType }, transaction: t });
            await db.Wallet.update({ balance: toAccount.balance + amount }, { where: { address: toAddress, coinType }, transaction: t });
            t.commit();
            return true;
        } catch(e) {
            t.rollback();
            throw { msg: 'Failed to send transaction' };
        }
    }
};

module.exports = {
    findAll,
    findOne,
    create,
    update,
    sendTransaction
};