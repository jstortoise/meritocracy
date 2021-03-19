const db = require('../models');

const findAll = where => db.Vote.findAll({ where, raw: true });
const findOne = where => db.Vote.findOne({ where, raw: true });
const create = data => db.Vote.create(data);
const update = (data, where) => db.Vote.update(data, { where });
const remove = where => db.Vote.destroy({ where });
const count = where => db.Vote.count({ where });

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove,
    count,
}