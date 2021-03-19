const Keycloak = require('./keycloak');
const db = require('../models');

const findAllBy = options => db.Client.findAll({ ...options, raw: true });
const findAll = where => db.Client.findAll({ where, raw: true });
const findOne = where => db.Client.findOne({ where, raw: true });

const findOneBy = where => {
    return db.Client.findOne({
        include: [{
            model: db.User,
            as: 'creator',
            attributes: ['id', 'username', 'mid']
        }, {
            model: db.User,
            as: 'owner',
            attributes: ['id', 'username', 'mid']
        }],
        attributes: [
            'Client.*',
            [db.Sequelize.col('creator.mid'), 'creatorMid'],
            [db.Sequelize.col('creator.username'), 'creatorName'],
            [db.Sequelize.col('owner.mid'), 'ownerMid'],
            [db.Sequelize.col('owner.username'), 'ownerName']
        ],
        where, raw: true
    });
};

const findAllDetail = async options => {
    const { name, secret, id } = options.where;
    let sql = `
        SELECT
            a.*,
            COUNT(d.clientId) AS memberCount,
            b.username AS creatorUsername,
            CONCAT(b.firstName, ' ', b.lastName) AS creatorFullname,
            c.username AS ownerUsername,
            CONCAT(c.firstName, ' ', c.lastName) AS ownerFullname
        FROM Clients a
        LEFT JOIN Users b ON a.creatorId = b.id
        LEFT JOIN Users c ON a.ownerId = c.id
        LEFT JOIN MyClients d ON a.id = d.clientId
        WHERE 1 = 1
    `;
    
    let bind = [], index = 0;
    if (name) {
        index++;
        sql += ` AND a.name=$${index}`;
        bind.push(name);
    }
    if (secret) {
        index++;
        sql += ` AND a.secret=$${index}`;
        bind.push(secret);
    }
    if (id) {
        index++;
        sql += ` AND a.id=$${index}`;
        bind.push(id);
    }

    sql += ` GROUP BY a.secret`;
    
    let client = await db.querySelect(sql, bind, true);
    client.sessions = [];
    try {
        if (client) {
            client.sessions = await keycloak.getSessions(client.secret);
        }
    } catch(e) {}

    return client;
};

const create = async data => {
    const kcData = { name: clientId, rootUrl } = data;
    // Create client on keycloak
    const { id } = await Keycloak.createClient(kcData);

    data.secret = id;
    data.meritPoint = 0;
    if (data.type == 1) {
        data.meritPoint = 100;
    }

    // Create client on db
    return db.Client.create(data);
};

const update = async (data, where) => {
    const t = await db.sequelize.transaction();

    try {
        const client = await db.Client.findOne({ where, raw: true });
        await db.Client.update(data, { where, transaction: t });

        const { name: clientId, rootUrl } = data;
        const { secret } = client;

        if (clientId && rootUrl) {
            const kcData = { clientId, rootUrl };
            await Keycloak.updateClient(kcData, { id: secret });
        }

        t.commit();
    } catch(e) {
        t.rollback();
        throw e;
    }
    
    return true;
};

const updateOnly = (data, where) => db.Client.update(data, { where });

const remove = async where => {
    const t = await db.sequelize.transaction();
    try {
        const { secret } = await db.Client.findOne({ where, raw: true });
        await db.Client.destroy({ where, transaction: t });
        await Keycloak.removeClient({ id: secret });
        t.commit();
    } catch(e) {
        t.rollback();
        throw e;
    }
    return true;
};

module.exports = {
    findAll, findAllBy,
    findAllDetail,
    findOne, findOneBy,
    create,
    update,
    updateOnly,
    remove,
}