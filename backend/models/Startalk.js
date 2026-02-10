const mongoose = require('mongoose');

const startalkSchema = mongoose.Schema({
    // --- Post Content ---
    content: { type: String, required: true },
    imageUrl: { type: String },

    // --- Author Info ---
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String },
    authorAvatar: { type: String },
    authorHeadline: { type: String },

    // --- Interactions (CHANGE IS HERE) ---
    // Map ki jagah "Mixed" Object use kar rahe hain
    reactions: {
        type: mongoose.Schema.Types.Mixed, 
        default: {}
    },
    userReactions: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, {
    timestamps: true,
    minimize: false // ✅ Zaroori hai: Taki empty object {} database se gayab na ho
});

const Startalk = mongoose.model('Startalk', startalkSchema);
module.exports = Startalk;