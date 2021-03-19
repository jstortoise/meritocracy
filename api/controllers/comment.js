const db = require('../models');

const findAllBy = options => {
    let condition = {
        ...options,
        raw: true,
        include: [{
            model: db.User,
            as: 'user'
        }],
        attributes: ['*', [
            db.sequelize.fn('timestampdiff', db.sequelize.literal('month'), db.sequelize.col('Comment.createdAt'), db.sequelize.fn('now')),
            'agoMonth'
        ], [
            db.sequelize.fn('datediff', db.sequelize.fn('now'), db.sequelize.col('Comment.createdAt')),
            'agoDay'
        ], [
            db.sequelize.fn('hour', db.sequelize.fn('timediff', db.sequelize.fn('now'), db.sequelize.col('Comment.createdAt'))),
            'agoHour'
        ], [
            db.sequelize.fn('minute', db.sequelize.fn('timediff', db.sequelize.fn('now'), db.sequelize.col('Comment.createdAt'))),
            'agoMinute'
        ], [
            db.sequelize.fn('second', db.sequelize.fn('timediff', db.sequelize.fn('now'), db.sequelize.col('Comment.createdAt'))),
            'agoSecond'
        ]]
    };

    return db.Comment.findAll(condition);
};

const create = async (data, period = 'hour') => {
    const comment = await db.Comment.findOne({
        where: {
            $and: [
                db.sequelize.where(db.sequelize.fn(period, db.sequelize.col('createdAt')), {
                    $eq: db.sequelize.fn(period, db.sequelize.fn('now'))
                }),
                { clientId: data.clientId },
                { userId: data.userId }
            ]
        },
        raw: true
    });

    if (comment) throw { message: 'You already commented this month.' };
    
    return db.Comment.create(data);
};

const remove = where => db.Comment.destroy({ where });

const getCurrentCommentBy = (userId, clientId, period = 'hour') => {
    return new Promise((resolve, reject) => {
        db.Comment.findOne({
            where: {
                $and: [
                    db.sequelize.where(db.sequelize.fn(period, db.sequelize.col('createdAt')), {
                        $eq: db.sequelize.fn(period, db.sequelize.fn('now'))
                    }),
                    { clientId },
                    { userId }
                ]
            },
            raw: true
        }).then(comment => {
            resolve(comment);
        }).catch(err => {
            reject(err);
        });
    });
};

const getPrevCommentBy = (userId, clientId, period = 'hour') => {
    return db.Comment.findOne({
        where: {
            $and: [
                db.sequelize.where(db.sequelize.fn(period, db.sequelize.col('createdAt')), {
                    $eq:db.sequelize.fn(period,  db.sequelize.fn('DATE_SUB', db.sequelize.fn('now'), db.sequelize.literal('INTERVAL 1 ' + period)))
                }),
                { clientId },
                { userId }
            ]
        },
        raw: true
    });
};

const findOne = where => db.Comment.findOne({ where, raw: true });
const findOneBy = options => db.Comment.findOne({ ...options, raw: true });

module.exports = {
    findAllBy,
    create,
    remove,
    getCurrentCommentBy,
    getPrevCommentBy,
    findOne,
    findOneBy,
};