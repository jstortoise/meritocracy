const db = require('../models');

const findAll = where => db.Notification.findAll({ where, raw: true, order: [['createdAt', 'DESC']] });
const create = data => db.Notification.create(data);
const update = (data, where) => db.Notification.update(data, { where });
const remove = where => db.Notification.destroy({ where });

module.exports = {
    findAll,
    create,
    update,
    remove,
}