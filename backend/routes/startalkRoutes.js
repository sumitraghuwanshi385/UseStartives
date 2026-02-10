// backend/routes/startalkRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const {
  getStartalks,
  createStartalk,
  deleteStartalk,
  reactToStartalk, // ✅ import added
} = require('../controllers/startalkController');

const router = express.Router();

router.get('/', getStartalks);
router.post('/', protect, createStartalk);
router.post('/:id/react', protect, reactToStartalk); // ✅ now works
router.delete('/:id', protect, deleteStartalk);

module.exports = router;