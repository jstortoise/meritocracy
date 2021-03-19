'use strict';

module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        type : {
            type: DataTypes.TINYINT,
            defaultValue: 0 // 0: info, 1: warning
        },
        description : {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        isRead : {
            type: DataTypes.BOOLEAN,
            defaultValue: 0 // 0: unread, 1: read
        }
    });

    Notification.associate = ({ User }) => {
        Notification.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'cascade' });
    };

    return Notification;
};
