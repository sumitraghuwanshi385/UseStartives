const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// --- Helper: Format Chat for Frontend ---
const formatChat = (chat, currentUserId) => {
    // Determine contact (Other person in Direct, or Team details in Team)
    let contact = {};
    const chatObj = chat.toObject();
    
    if (chat.isTeam) {
        contact = {
            id: chatObj._id.toString(),
            name: chat.chatName,
            avatarUrl: chat.chatImage,
            isOnline: false 
        };
    } else {
        // Find the other user
        const otherUser = chat.users.find(u => u._id.toString() !== currentUserId.toString());
        if (otherUser) {
            contact = {
                id: otherUser._id.toString(),
                name: otherUser.name,
                avatarUrl: otherUser.profilePictureUrl,
                isOnline: false 
            };
        } else {
            // Self chat case
            contact = { id: "self", name: "Me", avatarUrl: "" };
        }
    }

    return {
        id: chatObj._id.toString(),
        contact: contact,
        messages: [], // Messages will be fetched separately or populated if needed
        lastMessagePreview: chat.lastMessage?.text || (chat.isTeam ? "Team created" : "Start chatting"),
        lastMessageTimestamp: chat.lastMessage?.timestamp || chat.createdAt,
        unreadCount: 0, // Logic can be added later
        isTeam: chat.isTeam,
        description: chat.description,
        adminId: chat.admin ? chat.admin.toString() : null,
        memberIds: chat.users.map(u => u._id.toString()),
        members: chat.users // Full user objects
    };
};

// @desc    Get all conversations for user
// @route   GET /api/chat
const fetchConversations = async (req, res) => {
    try {
        const chats = await Conversation.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', '-password') // Get user details
            .populate('admin', '-password')
            .sort({ updatedAt: -1 });

        const formattedChats = chats.map(c => formatChat(c, req.user._id));
        res.json({ success: true, chats: formattedChats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Start/Get Direct Chat
// @route   POST /api/chat
const createDirectChat = async (req, res) => {
    const { userId } = req.body; // Target User ID

    if (!userId) return res.status(400).json({ message: "UserId param not sent with request" });

    // 1. Check if chat exists
    let isChat = await Conversation.find({
        isTeam: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("users", "-password");

    if (isChat.length > 0) {
        res.json({ success: true, chat: formatChat(isChat[0], req.user._id) });
    } else {
        // 2. Create new chat
        var chatData = {
            chatName: "sender",
            isTeam: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Conversation.create(chatData);
            const fullChat = await Conversation.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.json({ success: true, chat: formatChat(fullChat, req.user._id) });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

// @desc    Create Team Chat
// @route   POST /api/chat/team
const createTeamChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    // users array should be JSON stringified IDs from frontend or simple array
    let users = req.body.users; // Expecting array of IDs

    if (users.length < 1) {
        return res.status(400).json({ message: "More than 2 users are required to form a group chat" });
    }

    users.push(req.user._id); // Add current user (admin)

    try {
        const groupChat = await Conversation.create({
            chatName: req.body.name,
            description: req.body.description,
            chatImage: req.body.image, // Optional image URL
            users: users,
            isTeam: true,
            admin: req.user._id,
        });

        const fullGroupChat = await Conversation.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("admin", "-password");

        res.status(200).json({ success: true, chat: formatChat(fullGroupChat, req.user._id) });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get All Messages
// @route   GET /api/chat/:chatId/messages
const fetchMessages = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.chatId })
            .populate("sender", "name profilePictureUrl email")
            .populate("readBy");

        const formattedMessages = messages.map(msg => ({
            id: msg._id.toString(),
            senderId: msg.sender._id.toString(),
            senderName: msg.sender.name,
            senderAvatar: msg.sender.profilePictureUrl,
            text: msg.text,
            type: msg.type,
            file: msg.file,
            timestamp: msg.createdAt,
            isRead: msg.readBy.some(u => u._id.toString() === req.user._id.toString())
        }));

        res.json({ success: true, messages: formattedMessages });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Send Message
// @route   POST /api/chat/:chatId/messages
const sendMessage = async (req, res) => {
    const { text, file, type } = req.body;
    const chatId = req.params.chatId;

    if (!text && !file) {
        return res.status(400).json({ message: "Invalid data passed into request" });
    }

    var newMessage = {
        sender: req.user._id,
        text: text,
        conversationId: chatId,
        type: type || 'text',
        file: file // { name, url, mimeType, size }
    };

    try {
        var message = await Message.create(newMessage);

        // Update Last Message in Conversation
        await Conversation.findByIdAndUpdate(chatId, {
            lastMessage: {
                text: text || (type === 'image' ? 'Sent an image' : 'Sent a file'),
                sender: req.user._id,
                timestamp: new Date()
            }
        });

        // Populate sender details for frontend
        message = await message.populate("sender", "name profilePictureUrl");
        
        const formattedMsg = {
            id: message._id.toString(),
            senderId: message.sender._id.toString(),
            text: message.text,
            timestamp: message.createdAt,
            type: message.type,
            file: message.file,
            isRead: false
        };

        res.json({ success: true, message: formattedMsg });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { fetchConversations, createDirectChat, createTeamChat, fetchMessages, sendMessage };