const db = require('../models');

const findAll = where => db.Badge.findAll({ where, raw: true });
const findOne = where => db.Badge.findOne({ where, raw: true });
const create = data => db.Badge.findOrCreate({ where: { userId: data.userId, badgeType: data.badgeType }, defaults: data });
const update = (data, where) => db.Badge.update(data, { where });
const remove = where => db.Badge.destroy({ where });

const findAllByUID = userId => {
    const sql = `
        SELECT
            a.*,
            b.title AS description
        FROM
            Badges a,
            BaseDetails b
        WHERE
            a.userId = $1 AND
            b.baseType = 2 AND
            b.code = a.badgeType
    `;
    return db.querySelect(sql, [ userId ]);
};

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove,
    findAllByUID,
};