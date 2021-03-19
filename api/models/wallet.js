'use strict';
/**
 * Field: coinType, address, private_key, balance, user_id
 * 0: GLX
 * 1: ETH
 * 2: BTC
 * 3: BCH
 */
module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
        coinType: {
            type: DataTypes.INTEGER,
            defaultValue: 0 // 0: GLX, 1: ETH, 2: BTC, 3: BCH
        },
        address: {
            type: DataTypes.STRING
        },
        privateKey: {
            type: DataTypes.STRING
        },
        publicKey: {
            type: DataTypes.STRING
        },
        balance: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false
        }
    });

    Wallet.associate = ({ User }) => {
        Wallet.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'cascade' });
    };

    return Wallet;
};
