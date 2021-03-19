const db = require('../models');

const findAll = where => db.Social.findAll({ where, raw: true });
const findOne = where => db.Social.findOne({ where, raw: true });
const create = data => db.Social.create(data);
const update = (data, where) => db.Social.update(data, { where });
const remove = where => db.Social.destroy({ where });

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove,
};
