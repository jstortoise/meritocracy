'use strict';
/**
 */
module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        postId : {
            type: DataTypes.INTEGER
        },
        rating : {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    Vote.associate = ({ User, Client }) => {
        Vote.belongsTo(Client, { as: 'client', foreignKey: 'clientId', onDelete: 'cascade' });
        Vote.belongsTo(User, { as: 'owner', foreignKey: 'ownerId', onDelete: 'cascade' });
        Vote.belongsTo(User, { as: 'voter', foreignKey: 'voterId', onDelete: 'cascade' });
    };

    return Vote;
};
