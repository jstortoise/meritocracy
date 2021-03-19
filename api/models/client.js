'use strict';

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        secret: {
            type: DataTypes.CHAR(36)
        },
        type: {
            type: DataTypes.TINYINT,
            defaultValue: 0 // 0: Legacy, 1: Certified, 2: Public
        },
        protocol: {
            type: DataTypes.STRING,
            defaultValue: 'openid-connect'
        },
        rootUrl: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
        meritPoint: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        oldPoint: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        }
    }, {
        indexes: [{
            fields: ['name'],
            unique: true
        }, {
            fields: ['secret'],
            unique: true
        }]
    });

    Client.associate = ({ Comment, MyClient, Option, Score, User, Vote }) => {
        Client.hasMany(Comment, { foreignKey: 'clientId' });
        Client.hasMany(MyClient, { foreignKey: 'clientId' });
        Client.hasMany(Option, { foreignKey: 'clientId' });
        Client.hasMany(Score, { foreignKey: 'clientId' });
        Client.hasMany(Vote, { foreignKey: 'clientId' });

        Client.belongsTo(User, { as: 'owner', foreignKey: 'ownerId', onDelete: 'SET NULL' });
        Client.belongsTo(User, { as: 'creator', foreignKey: 'creatorId', onDelete: 'RESTRICT' });
    };

    return Client;
};
