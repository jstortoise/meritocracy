'use strict';

module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
        hash: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        path: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        size: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        privateKey: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        publicKey: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
    });

    File.associate = ({ User }) => {
        File.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'cascade' });
    };

    return File;
};
