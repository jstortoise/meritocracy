const db = require('../models');

const findAll = where => db.Option.findAll({ where, raw: true });
const findOne = where => db.Option.findOne({ where, raw: true });
const create = data => db.Option.findOrCreate({ where: { clientId: data.clientId, field: data.field }, defaults: data });
const update = (data, where) => db.Option.update(data, { where });
const remove = where => db.Option.destroy({ where });

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove,
};