'use strict';
/**
 * Field: type
 * Value
 * 10: Organisation Merit Points Range
 * 11: Member Merit Points Range
 * 12: M2M Member Merit Points Range
 * 
 * 20: Member Total Score Range
 * 21: Organisation Total Score Range
 * 22: M2M Rating Range
 */

module.exports = (sequelize, DataTypes) => {
    const BaseField = sequelize.define('BaseField', {
        baseType : {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        fieldId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        fieldName: {
            type: DataTypes.STRING
        },
        fieldFrom : {
            type: DataTypes.INTEGER
        },
        fieldTo: {
            type: DataTypes.INTEGER
        },
        value: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    });

    BaseField.associate = ({ Base }) => {
        BaseField.belongsTo(Base, { as: 'base', foreignKey: 'baseType', onDelete: 'RESTRICT' });
    };

    return BaseField;
};
