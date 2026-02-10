const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // ✅ Imported

const { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    toggleSavedProject,
    getUserById 
} = require('../controllers/authController');

// --- PUBLIC ROUTES (No Login Required) ---
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/users/:id', getUserById); // ✅ Ye public rehna chahiye taaki sab profile dekh sakein

// --- PROTECTED ROUTES (Login Required) ---
// 🔒 Yahan 'protect' lagana zaroori hai
router.put('/profile', protect, updateUserProfile);      // ✅ Added protect
router.put('/save-project', protect, toggleSavedProject); // ✅ Added protect

module.exports = router;