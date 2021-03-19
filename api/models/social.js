'use strict';
module.exports = (sequelize, DataTypes) => {
    const Social = sequelize.define('Social', {
        socialType : {
            type: DataTypes.INTEGER, // 0: invalid, 1: google, 2: facebook, 3: twitter, 4: instagram
            defaultValue: 0
        },
        socialId : {
            type: DataTypes.CHAR(16)
        },
        originId: {
            type: DataTypes.CHAR(16)
        },
        keycloakId : {
            type: DataTypes.CHAR(36)
        }
    });

    Social.associate = ({ Email }) => {
        Social.belongsTo(Email, { as: 'email', foreignKey: 'emailId', onDelete: 'cascade' });
    };

    return Social;
};
