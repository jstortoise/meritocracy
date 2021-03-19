'use strict';
/**
 */
module.exports = (sequelize, DataTypes) => {
    const BaseDetail = sequelize.define('BaseDetail', {
        baseType : {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        code : {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        value: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        unit: {
            type: DataTypes.STRING(3),
            defaultValue: ''
        },
        description : {
            type: DataTypes.STRING,
            defaultValue: ''
        }
    });

    BaseDetail.associate = ({ Base }) => {
        BaseDetail.belongsTo(Base, { as: 'base', foreignKey: 'baseType', onDelete: 'cascade' });
    };

    return BaseDetail;
};
