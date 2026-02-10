const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    text: { type: String, trim: true },
    type: { type: String, default: 'text' }, // text, image, document, system
    
    // File Attachment Data
    file: {
        name: String,
        url: String,
        mimeType: String,
        size: Number
    },

    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // To show unread count
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);