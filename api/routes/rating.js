const express = require('express');

const Common = require('../controllers/common');
const Rating = require('../controllers/rating');

const router = express.Router();

router.post('/search', Common.verifyToken, async (req, res) => {
    try {
        const { ratings, totalCount } = await Rating.searchAllBy(req.body);
        // Success
        res.send({ success: true, data: ratings, totalCount });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;