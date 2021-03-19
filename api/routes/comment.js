const express = require('express');

const Common = require('../controllers/common');
const Cronjob = require('../controllers/cronjob');
const Comment = require('../controllers/comment');

const router = express.Router();

// comment endpoints
router.get('/:clientId/list', Common.verifyToken, async (req, res) => {
    try {
        const { clientId } = req.params;
        const comments = await Comment.findAllBy({ clientId });

        // Success
        res.send({ success: true, data: comments });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.put('/:clientId/create', Common.verifyToken, async (req, res) => {
    try {
        const { id: userId } = req.authData;
        const { clientId } = req.params;
        const data = { ...req.body, userId, clientId };

        // Create on DB
        await Comment.create(data);

        // Update consistency
        await Cronjob.calcConsistency();
        
        // Success
        res.send({ success: true, message: 'Commented successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.delete('/:id/delete', Common.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Remove from DB
        await Comment.remove({ id });
        // Update consistency
        await Cronjob.calcConsistency();
        
        // Success
        res.send({ success: true, message: 'Comment removed successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;
