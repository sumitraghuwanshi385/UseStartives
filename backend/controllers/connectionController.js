const User = require('../models/User');

// @desc    Send Connection Request
// @route   POST /api/connections/request/:id
const sendRequest = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        // Check validation
        if (currentUser.connections.includes(targetUser._id)) {
            return res.status(400).json({ message: 'Already connected' });
        }
        if (targetUser.connectionRequests.includes(currentUser._id)) {
            return res.status(400).json({ message: 'Request already sent' });
        }

        // 1. Target ke inbox me request dalo
        targetUser.connectionRequests.push(currentUser._id);
        
        // 2. Apne sent box me record karo (Fixes "Request Sent" button state)
        if (!currentUser.sentRequests) currentUser.sentRequests = [];
        currentUser.sentRequests.push(targetUser._id);

        await targetUser.save();
        await currentUser.save();

        res.json({ success: true, message: 'Request sent' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Accept Connection Request
// @route   POST /api/connections/accept/:id
const acceptRequest = async (req, res) => {
    try {
        const requesterId = req.params.id; // Jisne request bheji thi
        const currentUser = await User.findById(req.user._id); // Main (Accept karne wala)
        const requesterUser = await User.findById(requesterId); 

        if (!currentUser || !requesterUser) return res.status(404).json({ message: 'User not found' });

        if (!currentUser.connectionRequests.includes(requesterId)) {
            return res.status(400).json({ message: 'No request from this user' });
        }

        // 1. Dono ko connect karo
        currentUser.connections.push(requesterId);
        requesterUser.connections.push(currentUser._id);

        // 2. Mere inbox se request hatao
        currentUser.connectionRequests = currentUser.connectionRequests.filter(id => id.toString() !== requesterId);

        // 3. Uske 'sentRequests' se hatao (Clean up)
        if (requesterUser.sentRequests) {
            requesterUser.sentRequests = requesterUser.sentRequests.filter(id => id.toString() !== currentUser._id.toString());
        }

        await currentUser.save();
        await requesterUser.save();

        res.json({ success: true, message: 'Request accepted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// getConnections same rahega
const getConnections = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('connections', 'name headline profilePictureUrl');
        res.json({ success: true, connections: user.connections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { sendRequest, acceptRequest, getConnections };