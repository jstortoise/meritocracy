'use strict';

module.exports = (sequelize, DataTypes) => {
    const Email = sequelize.define('Email', {
        email : {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        isPrimary: {
            type: DataTypes.BOOLEAN, // 0: Secondary, 1: Primary
            defaultValue: 0
        },
        isVerified : {
            type: DataTypes.BOOLEAN, // 0: Unverified, 1: Verified
            defaultValue: 0
        },
        isActive: {
            type: DataTypes.BOOLEAN, // 0: Suspended, 1: Active
            defaultValue: 1
        },
        isResetPwd: {
            type: DataTypes.BOOLEAN, // 0: normal, 1: reset password requested
            defaultValue: 0
        }
    });

    Email.associate = ({ Social, User }) => {
        Email.hasMany(Social, { foreignKey: 'emailId' });
        Email.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'cascade' });
    };

    return Email;
};
