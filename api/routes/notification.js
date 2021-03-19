const express = require('express');

const Common = require('../controllers/common');
const Notification = require('../controllers/notification');

const router = express.Router();

router.get('/list/:isRead', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const { isRead } = req.params;
        
        let where = { userId };
        if (isRead >= 0) {
            where.isRead = isRead;
        }

        const data = await Notification.findAll(where);
        
        // Success
        res.send({ success: true, data });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.put('/:id/update', Common.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await Notification.update(data, { id });
        // Success
        res.send({ success: true, message: 'Notification updated successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.delete('/:id/delete', Common.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.remove({ id });
        // Success
        res.send({ success: true, message: 'Notification removed successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;