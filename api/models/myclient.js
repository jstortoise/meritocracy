'use strict';

module.exports = (sequelize, DataTypes) => {
    const MyClient = sequelize.define('MyClient', {
        testScore : {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        mpRating : {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        m2mRating : {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        consistency : {
            type: DataTypes.FLOAT,
            // defaultValue: 100
        },
        isCommented : {
            type: DataTypes.BOOLEAN, // 0: consistency calculated until (n-1)th comment, -1: (n-1)th comment's consistency not calculated, 1: calculated consistency until n-th comment
            defaultValue: 0
        },
    });

    MyClient.associate = ({ User, Client }) => {
        MyClient.belongsTo(Client, { as: 'client', foreignKey: 'clientId', onDelete: 'cascade' });
        MyClient.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'cascade' });
        
        Client.afterCreate((client, options) => {
            const clientData = client.get({ plain: true });
            const t = options.transaction;
            const data = {
                clientId: clientData.id,
                userId: clientData.ownerId
            };
            MyClient.create(data).then(() => {
                if (t) {
                    t.commit();
                }
            }).catch(() => {
                if (t) {
                    t.rollback();
                }
            });
        });
    };

    return MyClient;
};
