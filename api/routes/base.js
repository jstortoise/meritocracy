const express = require('express');

const Common = require('../controllers/common');
const Base = require('../controllers/base');
const BaseDetail = require('../controllers/baseDetail');
const BaseField = require('../controllers/baseField');

const router = express.Router();

router.get('/list', Common.verifyToken, async (req, res) => {
    try {
        const data = await Base.findAll();
        // Success
        res.send({ success: true, data });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.get('/detail/:baseType/list', Common.verifyToken, async (req, res) => {
    try {
        const { baseType } = req.params;
        const data = await BaseDetail.findAll({ baseType });
        // Success
        res.send({ success: true, data });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.get('/field/:baseType/list', Common.verifyToken, async (req, res) => {
    try {
        const { baseType } = req.params;
        const data = await BaseField.findAll({ baseType });
        // Success
        res.send({ success: true, data });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;
