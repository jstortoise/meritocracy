const express = require('express');

const Badge = require('../controllers/badge');
const Common = require('../controllers/common');
const Client = require('../controllers/client');
const Vote = require('../controllers/vote');

const router = express.Router();

router.post('/list', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const { clientId } = req.body;
        const client = await Client.findOne({ id: clientId });

        if (!client) {
            res.send({ success: false, message: 'Organisation not exists' });
            return;
        }
        
        const votes = await Vote.findAll({ clientId });

        // Success
        res.send({ success: true, data: votes, userId });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/detail', Common.verifyToken, async (req, res) => {
    try {
        const { clientId, postId } = req.body;
        const { id: voterId } = req.authData;
        const client = await Client.findOne({ clientId });

        if (!client) {
            res.send({ success: false, message: 'Organisation not exists' });
            return;
        }
        
        const vote = await Vote.findOne({ clientId, postId, voterId });
        
        // Success;
        res.send({ success: true, data: vote });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/cancel', Common.verifyToken, async (req, res) => {
    try {
        const { clientId, postId } = req.body;
        const { id: voterId } = req.authData;
        const client = await Client.findOne({ id: clientId });

        if (!client) {
            res.send({ success: false, message: 'Organisation not exists' });
            return;
        }
        
        await Vote.remove({ clientId, postId, voterId })
        // Success;
        res.send({ success: true });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/up_down', Common.verifyToken, async (req, res) => {
    try {
        let { clientId, postId, upDown } = req.body;
        const { id: voterId } = req.authData;
        
        upDown = upDown > 0 ? 1 : -1;

        const client = await Client.findOne({ id: clientId });
        if (!client) {
            res.send({ success: false, message: 'Organisation not exists' });
            return;
        }

        const { ownerId } = client;
        if (voterId == ownerId) {
            res.send({ success: false, message: 'You cannot vote yourself' });
            return;
        }
        
        const vote = await Vote.findOne({ clientId, voterId, postId });
        if (vote) {
            await Vote.update({ rating: upDown }, { clientId, voterId, postId });
        } else {
            await Vote.create({ clientId, ownerId, voterId, postId, rating: upDown });
        }
        
        const count = await Vote.count({ ownerId });
        if (count >= 100) {
            await Badge.create({ userId: ownerId, badgeType: 8 });
        }
        
        // Success
        res.send({ success: true });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;