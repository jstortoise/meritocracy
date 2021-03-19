const express = require('express');

const common = require('../controllers/common');
const Badge = require('../controllers/badge');

const router = express.Router();

// Get badge list of the current user including badge title
router.get('/list', common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const data = await Badge.findAllByUID(userId);
        // Success
        res.send({ success: true, data });
    } catch(e) {
        // Failed
        console.log(e);
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;
