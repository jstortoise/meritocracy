const express = require('express');

const Common = require('../controllers/common');
const Client = require('../controllers/client');
const MyClient = require('../controllers/myClient');

const router = express.Router();

router.put('/create', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const { name, type, rootUrl, ownerId } = req.body;
        let data = {
            name, type, rootUrl, ownerId,
            creatorId: userId
        }

        if (!ownerId || ownerId == 'Myself') {
            data.ownerId = userId;
        }

        const client = await Client.findOne({ $or: [{ name }, { rootUrl }] });
        if (client) {
            res.send({ success: false, message: 'App already exists with same name or domain' });
            return;
        }
        
        const { secret } = await Client.create(data);
        
        // Success
        res.send({ success: true, data: { secret }, message: 'Successfully added' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.put('/:id/update', Common.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const client = await Client.findOne({ id: { $ne: id }, name: data.name });
        if (client) {
            res.send({ success: false, message: 'Organisation name already exists' });
            return;
        }
        
        await Client.update(data, { id });
        // Success
        res.send({ success: true, message: 'Organsation updated successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
})

router.get('/:id/detail', Common.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findAllDetail({ where: { id } });
        
        // Success
        res.send({ success: true, data: client });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.get('/me', Common.verifyClient, async (req, res) => {
    try {
        const { id } = req.authData;
        const client = await Client.findOneBy({ id });
        // Success
        res.send({ success: true, data: client });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.delete('/:id/delete', Common.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        await Client.remove({ id });
        // Success
        res.send({ success: true, message: 'Successfully removed' });
    } catch(e) {
        // Failed
        // console.log(e);
        res.send({ success: false, message: e.message });
    }
});

router.post('/list', Common.verifyToken, async (req, res) => {
    // search params
    try {
        const { type, keyword, pageNum, pageSize, sortBy, ascDesc } = req.body;

        let whereSql = `WHERE a.name LIKE $1 OR a.secret LIKE $1`;

        if (type >= 0) {
            whereSql += ` AND a.type = ${type}`;
        }
        let countSql = `SELECT COUNT(*) AS totalCount FROM Clients a ${whereSql}`;
        let listSql = `
            SELECT
                a.*,
                COUNT(b.userId) AS totalUsers,
                SUM(IF (c.role <= 1, 1, 0)) AS adminCount,
                SUM(IF (c.role > 1, 1, 0)) AS managerCount
            FROM Clients a
            LEFT JOIN MyClients b ON a.id = b.clientId
            LEFT JOIN Users c ON b.userId = c.id
            ${whereSql}
            GROUP BY a.id
        `;

        if (sortBy && ascDesc) {
            listSql += ` ORDER BY ${sortBy} ${ascDesc}`;
        }


        if (pageNum && pageSize) {
            let offset = (pageNum - 1) * pageSize;
            let limit = offset + pageSize;
            listSql += ` LIMIT ${offset}, ${limit}`;
        }

        const totalCount = await Common.querySelect(countSql, [ `%${keyword}%` ], true);
        const clients = await Common.querySelect(listSql, [ `%${keyword}%` ]);
        
        // Success
        res.send({ success: true, data: clients, ...totalCount });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/list/me', Common.verifyToken, async (req, res) => {
    // search params
    try {
        const { id: userId } = req.authData;
        const { type, keyword, pageNum, pageSize, sortBy, ascDesc } = req.body;

        let whereSql = `WHERE (a.name LIKE $1 OR a.secret LIKE $1) AND (a.ownerId = $2 OR a.creatorId = $2)`;

        if (type >= 0) {
            whereSql += ` AND a.type = ${type}`;
        }

        let countSql = `SELECT COUNT(*) AS totalCount FROM Clients a ${whereSql}`;

        let listSql = `
            SELECT
                a.*,
                d.username AS creatorName,
                e.username AS ownerName,
                COUNT(b.userId) AS totalUsers,
                SUM(IF (c.role <= 1, 1, 0)) AS adminCount,
                SUM(IF (c.role > 1, 1, 0)) AS managerCount
            FROM Clients a
            LEFT JOIN MyClients b ON a.id = b.clientId
            LEFT JOIN Users c ON b.userId = c.id
            LEFT JOIN Users d ON a.creatorId = d.id
            LEFT JOIN Users e ON a.ownerId = e.id
            ${whereSql}
            GROUP BY a.id
        `;

        if (sortBy && ascDesc) {
            listSql += ` ORDER BY ${sortBy} ${ascDesc}`;
        }

        if (pageNum && pageSize) {
            let offset = (pageNum - 1) * pageSize;
            let limit = offset + pageSize;
            listSql += ` LIMIT ${offset}, ${limit}`;
        }

        const totalCount = await Common.querySelect(countSql, [ `%${keyword}%`, userId ], true);
        const clients = await Common.querySelect(listSql, [ `%${keyword}%`, userId ]);
        
        // Success
        res.send({ success: true, data: clients, ...totalCount });
    } catch(e) {
        // Failed
        console.log(e);
        res.send({ success: false, message: e.message });
    }
});

router.get('/:userId/list', Common.verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const myClients = await MyClient.findBy({ where: { userId } });
        
        // Success
        res.send({ success: true, data: myClients });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;
