'use strict';
/**
 * Field: type, field, value
 * Type = 0: Tip options
 */
module.exports = (sequelize, DataTypes) => {
    const Option = sequelize.define('Option', {
        type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        field: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Option.associate = ({ Client }) => {
        Option.belongsTo(Client, { as: 'client', foreignKey: 'clientId', onDelete: 'cascade' });
    };

    return Option;
};
