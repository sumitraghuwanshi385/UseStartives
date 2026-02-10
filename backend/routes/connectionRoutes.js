const express = require('express');
const { sendRequest, acceptRequest, getConnections } = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/request/:id', protect, sendRequest);
router.post('/accept/:id', protect, acceptRequest);
router.get('/', protect, getConnections);

module.exports = router;