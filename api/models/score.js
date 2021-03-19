'use strict';
module.exports = (sequelize, DataTypes) => {
    const Score = sequelize.define('Score', {
        key : {
            type: DataTypes.STRING
        },
        value : {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    }, {
        indexes: [{
            fields: ['key', 'userId', 'clientId'],
            unique: true
        }]
    });

    Score.associate = ({ User, Client }) => {
        Score.belongsTo(Client, { as: 'client', foreignKey: 'clientId', onDelete: 'cascade' });
        Score.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'cascade' });
    };

    return Score;
};
