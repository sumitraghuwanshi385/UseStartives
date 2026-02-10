const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
    fetchConversations, 
    fetchMessages, 
    sendMessage, 
    createTeamChat,
    createDirectChat 
} = require('../controllers/chatController');

const router = express.Router();

// Get list of all chats (Direct & Teams)
router.get('/', protect, fetchConversations);

// Start a direct chat (or get existing)
router.post('/', protect, createDirectChat);

// Create a new Team
router.post('/team', protect, createTeamChat);

// Get messages of a specific chat
router.get('/:chatId/messages', protect, fetchMessages);

// Send a message
router.post('/:chatId/messages', protect, sendMessage);

module.exports = router;