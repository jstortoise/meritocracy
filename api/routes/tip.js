const express = require('express');

const Common = require('../controllers/common');
const Option = require('../controllers/option');

const router = express.Router();

router.put('/options', Common.verifyClient, async (req, res) => {
    try {
        const { tipBtc, tipBch, tipEth, tipGlx } = req.body;
        const { id: clientId } = req.authData;

        // Update BTC option
        const btcField = await Option.findOne({ type: 0, clientId, field: 'btc' });
        if (btcField) {
            await Option.update({ value: tipBtc || 0 }, { type: 0, clientId, field: 'btc' });
        } else {
            await Option.create({ type: 0, clientId, field: 'btc', value: tipBtc || 0 });
        }

        // Update BCH option
        const bchField = await Option.findOne({ type: 0, clientId, field: 'bch' });
        if (bchField) {
            await Option.update({ value: tipBch || 0 }, { type: 0, clientId, field: 'bch' });
        } else {
            await Option.create({ type: 0, clientId, field: 'bch', value: tipBch || 0 });
        }

        // Update ETH option
        const ethField = await Option.findOne({ type: 0, clientId, field: 'eth' });
        if (ethField) {
            await Option.update({ value: tipEth || 0 }, { type: 0, clientId, field: 'eth' });
        } else {
            await Option.create({ type: 0, clientId, field: 'eth', value: tipEth || 0 });
        }

        // Update GLX option
        const glxField = await Option.findOne({ type: 0, clientId, field: 'glx' });
        if (glxField) {
            await Option.update({ value: tipGlx || 0 }, { type: 0, clientId, field: 'glx' });
        } else {
            await Option.create({ type: 0, clientId, field: 'glx', value: tipGlx || 0 });
        }

        // Success
        res.send({ success: true, message: 'Updated tip options successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.get('/options', Common.verifyClient, async (req, res) => {
    try {
        const { id: clientId } = req.authData;
        const options = await Option.findAll({ type: 0, clientId });

        let data = { btc: 0, bch: 0, eth: 0, glx: 0 };
        options.forEach(obj => {
            data[obj.field] = obj.value;
        });

        // Success
        res.send({ success: true, data });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/options/:clientId', Common.verifyToken, async (req, res) => {
    try {
        const { clientId } = req.params;
        const options = await Option.findAll({ type: 0, clientId });

        let data = { btc: 0, bch: 0, eth: 0, glx: 0 };
        options.forEach(obj => {
            data[obj.field] = obj.value;
        });

        // Success
        res.send({ success: true, data });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;