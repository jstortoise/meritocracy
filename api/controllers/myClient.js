const db = require('../models');

const findAll = where => db.MyClient.findAll({ where, raw: true });

const findBy = options => {
    return db.MyClient.findAll({
        ...options,
        include: [{
            model: db.Client,
            as: 'client',
            attributes: ['name', 'creatorId', 'ownerId']
        }],
        attributes: [
            'MyClient.*',
            [db.Sequelize.col('client.name'), 'clientName'],
            [db.Sequelize.col('client.creatorId'), 'creatorId'],
            [db.Sequelize.col('client.ownerId'), 'ownerId']
        ],
        raw: true
    });
};

const create = data => db.MyClient.create(data);
const update = (data, where) => db.MyClient.update(data, { where });

module.exports = {
    findAll,
    findBy,
    create,
    update,
};
