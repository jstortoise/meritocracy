const db = require('../models');

const findAll = where => db.Score.findAll({ where, raw: true });
const findOne = where => db.Score.findOne({ where, raw: true });
const create = data => db.Score.create(data);
const update = (data, where) => db.Score.update(data, { where });

// Create or Update
const upsert = async data => {
    const { key, userId, clientId } = data;
    const score = await db.Score.findOne({ where: { key, userId, clientId } });
    if (score) {
        await db.Score.update(data, { where: { key, userId, clientId } });
    } else {
        await db.Score.create(data);
    }
    const where = { userId, clientId };
    const sum = (await db.Score.findAll({ where, raw: true })).reduce((sum, score) => sum + (score.value || 0), 0);
    return db.MyClient.update({ testScore: sum }, { where });

}
const remove = where => db.Score.destroy({ where });

module.exports = {
    findAll,
    findOne,
    create,
    update,
    upsert,
    remove,
};
