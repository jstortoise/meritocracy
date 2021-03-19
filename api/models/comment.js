'use strict';

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        rating : {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        description : {
            type: DataTypes.STRING,
            defaultValue: ''
        }
    });

    Comment.associate = ({ User, Client }) => {
        Comment.belongsTo(Client, { as: 'client', foreignKey: 'clientId', onDelete: 'cascade' });
        Comment.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'cascade' });
    };

    return Comment;
};
