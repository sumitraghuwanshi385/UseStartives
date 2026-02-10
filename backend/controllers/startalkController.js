const Startalk = require('../models/Startalk');
const User = require('../models/User');

// Formatter (Ab Map conversion ki zaroorat nahi hai)
const formatTalk = (t) => {
    const obj = t.toObject ? t.toObject() : t;
    obj.id = obj._id ? obj._id.toString() : t.id;
    
    // ✅ FIX FOR "NaNd ago":
    // Frontend expects "timestamp", Backend has "createdAt"
    obj.timestamp = obj.createdAt; 

    delete obj._id;
    delete obj.__v;
    
    obj.reactions = obj.reactions || {};
    obj.userReactions = obj.userReactions || {};
    return obj;
};

// GET /api/startalks
const getStartalks = async (req, res) => {
    try {
        // .lean() brings plain JS objects (Fast & No Bugs)
        const talks = await Startalk.find().sort({ createdAt: -1 }).lean();
        return res.json({ success: true, startalks: talks.map(formatTalk) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/startalks
const createStartalk = async (req, res) => {
    try {
        const { content, imageUrl } = req.body;
        if (!content) return res.status(400).json({ success: false, message: 'Content required' });

        const user = await User.findById(req.user._id).lean();
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const talk = await Startalk.create({
            authorId: user._id,
            authorName: user.name,
            authorAvatar: user.profilePictureUrl,
            authorHeadline: user.headline,
            content: content,
            imageUrl: imageUrl,
            reactions: {}, 
            userReactions: {}
        });

        return res.status(201).json({ success: true, startalk: formatTalk(talk) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/startalks/:id
const deleteStartalk = async (req, res) => {
    try {
        const talk = await Startalk.findById(req.params.id);
        if (!talk) return res.status(404).json({ success: false, message: 'Not found' });
        if (talk.authorId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false });

        await talk.deleteOne();
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// --- REACT FUNCTION (SIMPLE & WORKING) ---
const reactToStartalk = async (req, res) => {
    try {
        const { emoji } = req.body;
        const userId = req.user._id.toString();
        const talkId = req.params.id;

        if (!emoji) return res.status(400).json({ success: false, message: 'Emoji required' });

        // 1. Current Data nikalo (as plain object)
        const talk = await Startalk.findById(talkId).lean();
        if (!talk) return res.status(404).json({ success: false, message: 'Startalk not found' });

        // 2. Data copy karo
        let reactions = { ...talk.reactions }; // Copy object
        let userReactions = { ...talk.userReactions }; // Copy object

        const previousEmoji = userReactions[userId];

        // 3. Logic (Plain Javascript Object Logic)
        if (previousEmoji === emoji) {
            // Remove (Undo)
            if (reactions[emoji] > 0) reactions[emoji]--;
            if (reactions[emoji] <= 0) delete reactions[emoji];
            delete userReactions[userId];
        } else {
            // Switch / Add
            if (previousEmoji) {
                if (reactions[previousEmoji] > 0) reactions[previousEmoji]--;
                if (reactions[previousEmoji] <= 0) delete reactions[previousEmoji];
            }
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            userReactions[userId] = emoji;
        }

        // 4. Update Database (Direct Replacement)
        // Mixed type me seedha pura object replace karna sabse safe hai
        const updatedTalk = await Startalk.findByIdAndUpdate(
            talkId,
            { 
                $set: { 
                    reactions: reactions, 
                    userReactions: userReactions 
                } 
            },
            { new: true, lean: true } // Return new doc
        );

        console.log("Updated DB Response:", updatedTalk.reactions); // Check terminal

        return res.json({ success: true, startalk: formatTalk(updatedTalk) });

    } catch (err) {
        console.error('React Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getStartalks, createStartalk, deleteStartalk, reactToStartalk };