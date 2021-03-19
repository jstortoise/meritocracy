'use strict';
/**
 * Field: type
 * Value
 * 0: Email Verified Badge
 * 1: Google Acccount Added Badge
 * 2: Facebook Acccount Added Badge
 * 3: Twitter Acccount Added Badge
 * 4: Instagram Acccount Added Badge
 * 5: Tipped for the first time
 * 6: Tipped on amount accumulated
 * 7: Received a Tip first time
 */
module.exports = (sequelize, DataTypes) => {
    const Tip = sequelize.define('Tip', {
        tipAmount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        tokenAmount: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        coinType: {
            type: DataTypes.INTEGER,
            defaultValue: 0 // 0: GLX, 1: ETH, 2: BTC, 3: BCH
        },

    });

    Tip.associate = ({ User }) => {
        Tip.belongsTo(User, { as: 'sender', foreignKey: 'senderId', onDelete: 'cascade' });
        Tip.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId', onDelete: 'cascade' });
    };

    return Tip;
};
