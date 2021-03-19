const express = require('express');

const Common = require('../controllers/common');
const Wallet = require('../controllers/wallet');
const Transaction = require('../controllers/transaction');

const router = express.Router();

router.post('/list', Common.verifyToken, async (req, res) => {
    try {
        const { keyword, pageNum, pageSize } = req.body;
        const condition = {
            $or: [{
                from: { $like: `%${keyword}%` }
            }, {
                to: { $like: `%${keyword}%` }
            }]
        };

        const order = [
            ['createdAt', 'DESC']
        ];

        const transactions = await Transaction.findAll({ where: condition, order, offset: (pageNum - 1) * pageSize, limit: pageSize }) || [];
        const totalCount = await Transaction.count(condition);

        // Success
        res.send({ success: true, data: { transactions, totalCount } });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/list/me', Common.verifyToken, async (req, res) => {
    try {
        const { keyword, pageNum, pageSize } = req.body;
        const { id: userId } = req.authData;
        const wallet = await Wallet.findOne({ userId });
        const condition = {
            $or: [{
                from: { $like: `%${keyword}%` }
            }, {
                to: { $like: `%${keyword}%` }
            }],
            $or: [{
                from: wallet.address
            }, {
                to: wallet.address
            }]
        };
    
        const transactions = await Transaction.findAll(condition, (pageNum - 1) * pageSize , pageSize) || [];
        const totalCount = await Transaction.count(condition);

        // Success
        res.send({ success: true, data: { transactions, totalCount } });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;