'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        firstName: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        lastName: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 3
        },
        mid: {
            type: DataTypes.CHAR(16),
            defaultValue: ''
        },
        privateKey: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        publicKey: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        mpRating: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        m2mRating: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        status: {
            type: DataTypes.INTEGER, // 0: Disabled, 1: Active
            defaultValue: 0
        }
    }, {
        indexes: [{
            fields: ['id'],
            unique: true
        }, {
            fields: ['username'],
            unique: true
        }, {
            fields: ['mid'],
            unique: true
        }, {
            fields: ['firstname', 'lastname']
        }]
    });

    const cryptPassword = password => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return reject(err);
      
                bcrypt.hash(password, salt, (err, hash) =>  {
                    if (err) return reject(err);
                    return resolve(hash);
                });
            });
        });
    };
    
    User.beforeCreate(async user => {
        return cryptPassword(user.password).then(crypted => user.password = crypted);
    });

    User.beforeUpdate(async user => {
        if (user.password) {
            return cryptPassword(user.password).then(crypted => user.password = crypted);
        }
    });

    User.associate = ({ Badge, Client, Comment, Email, File, MyClient, Notification, Score, Social, Tip, Vote, Wallet }) => {
        User.hasMany(Badge, { foreignKey: 'userId' });
        User.hasMany(Comment, { foreignKey: 'userId' });
        User.hasMany(Client, { foreignKey: 'ownerId' });
        User.hasMany(Client, { foreignKey: 'creatorId' });
        User.hasMany(Email, { foreignKey: 'userId' });
        User.hasMany(File, { foreignKey: 'userId' });
        User.hasMany(MyClient, { foreignKey: 'userId' });
        User.hasMany(Notification, { foreignKey: 'userId' });
        User.hasMany(Score, { foreignKey: 'userId' });
        User.hasMany(Tip, { foreignKey: 'senderId' });
        User.hasMany(Tip, { foreignKey: 'receiverId' });
        User.hasMany(Vote, { foreignKey: 'ownerId' });
        User.hasMany(Vote, { foreignKey: 'voterId' });
        User.hasMany(Wallet, { foreignKey: 'userId' });
    };

    return User;
};
