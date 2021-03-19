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
 * 7: Received a Tip more than 100 Tokens
 * 8: Received 100 Upvotes
 * 9: Received a Tip first time
 * 10: Sent a GLX Tip
 * 11: Sent a ETH Tip
 * 12: Sent a BTC Tip
 * 13: Sent a BCH Tip
 * 20: Received a GLX Tip
 * 21: Received a ETH Tip
 * 22: Received a BTC Tip
 * 23: Received a BCH Tip
 */

module.exports = (sequelize, DataTypes) => {
    const Badge = sequelize.define('Badge', {
        badgeType: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Badge.associate = ({ User }) => {
        Badge.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'cascade' });
    };

    return Badge;
};
