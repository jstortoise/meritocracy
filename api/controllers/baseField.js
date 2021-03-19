const db = require('../models');

const findAll = where => db.BaseField.findAll({ where, raw: true });
const findOne = where => db.BaseField.findOne({ where, raw: true });
const create = data => db.BaseField.create(data);
const createMany = datas => db.BaseField.bulkCreate(datas);
const update = (data, where) => db.BaseField.update(data, { where });
const updateMany = (datas, wheres) => db.BaseField.bulkUpdate(datas, wheres);
const remove = where => db.BaseField.destroy({ where });

module.exports = {
    findAll,
    findOne,
    create,
    createMany,
    update,
    updateMany,
    remove,
};
