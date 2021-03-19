const db = require('../models');

const findAll = where => db.Tip.findAll({ where, raw: true });
const create = data => db.Tip.create(data);
const count = where => db.Tip.count({ where });

const getTokenAmount = receiverId => {
    const sql = `SELECT SUM(tokenAmount) AS tokenAmount FROM Tips WHERE receiverId=$1`;
    return db.querySelect(sql, [ receiverId ], true).then(data => data.tokenAmount).catch(err => 0);
};

module.exports = {
    findAll,
    create,
    count,
    getTokenAmount
};