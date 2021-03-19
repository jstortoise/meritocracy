const db = require('../models');

const findAll = where => db.Base.findAll({ where, raw: true });
const findOne = where => db.Base.findOne({ where, raw: true });
const create = data => db.Base.create(data);
const update = (data, where) => db.Base.update(data, { where });
const remove = where => db.Base.destroy({ where });

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove,
};
