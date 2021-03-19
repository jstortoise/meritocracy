const db = require('../models');

const findAll = options => db.Transaction.findAll({ ...options, raw: true });
const findOne = where => db.Transaction.findOne({ where, raw: true });
const create = data => db.Transaction.create(data);
const update = (data, where) => db.Transaction.update(data, { where });
const remove = where => db.Transaction.destroy({ where });
const count = where => db.Transaction.count({ where });

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove,
    count,
};
