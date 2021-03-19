'use strict';
/**
 * coinType: 0 - GLX, 1 - ETH, 2 - BTC, 3 - BCH
 * tx_type: 0 - Tip, 1 - Deposit, 2 - Withdraw
 */

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        coinType: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        txHash: {
            type: DataTypes.STRING
        },
        txType: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        block: {
            type: DataTypes.STRING
        },
        from: {
            type: DataTypes.STRING
        },
        to: {
            type: DataTypes.STRING
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        txFee: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        description: {
            type: DataTypes.STRING
        }
    });

    return Transaction;
};
