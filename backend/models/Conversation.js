const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    isTeam: { type: Boolean, default: false },
    chatName: { type: String, trim: true }, // For Teams
    chatImage: { type: String }, // For Teams
    description: { type: String }, // For Teams
    
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who created the team
    
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // All members
    
    lastMessage: {
        text: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);