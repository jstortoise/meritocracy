const db = require('../models');

const findAll = where => db.Email.findAll({ where, raw: true });
const findOne = where => db.Email.findOne({ where, raw: true });
const create = data => db.Email.create(data);
const update = (data, where) => db.Email.update(data, { where });
const remove = where => db.Email.destroy({ where });

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove,
};