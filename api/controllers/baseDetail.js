const db = require('../models');

const findAll = where => db.BaseDetail.findAll({ where, raw: true });
const findOne = where => db.BaseDetail.findOne({ where, raw: true });
const create = data => db.BaseDetail.create(data);
const update = (data, where) => db.BaseDetail.update(data, { where });
// const updateMany = (datas, wheres) => db.BaseDetail.bulkUpdate(datas, wheres);

/**
 * Update many different fields
 * @param {Array} datas Array of object. e.g. [{ data: { title, description, value, ... }, where: { baseType, code } }]
 */
const updateMany = async datas => {
    const t = await db.sequelize.transaction();

    try {
        for (const { data, where } of datas) {
            await db.BaseDetail.update(data, { where, transaction: t });
        }
        t.commit();
    } catch(e) {
        t.rollback();
        throw e;
    }

    return true;
};

module.exports = {
    findAll,
    findOne,
    create,
    update,
    updateMany,
};
