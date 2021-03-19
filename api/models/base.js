'use strict';
/**
 * Field: type
 * Value
 * 0: User type
 * 1: Organisation type
 * 2: Badge type
 * 3: Weight (Organisation Weight, Consistency Increase/Decrease)
 * 4: Tip & Token
 * 5: Social type (0: invalid, 1: google, 2: facebook, 3: twitter, 4: instagram)
 * 10: Organisation Merit Point
 * 11: Member Merit Point
 * 12: M2M Merit Point
 * 20: User Test Score
 * 21: Organisation Score
 * 22: M2M Feedback
 */
module.exports = (sequelize, DataTypes) => {
    const Base = sequelize.define('Base', {
        type : {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        description : {
            type: DataTypes.STRING,
            defaultValue: ''
        }
    });

    Base.associate = ({ BaseDetail, BaseField }) => {
        Base.hasMany(BaseDetail, { foreignKey: 'baseType' });
        Base.hasMany(BaseField, { foreignKey: 'baseType' });
    };

    return Base;
};
