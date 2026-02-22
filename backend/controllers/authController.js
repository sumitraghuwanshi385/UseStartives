// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// --- Generate Token ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            email,
            password,
            name: name || '',
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid user data' });
        }

        // Email sending (non-blocking)
        try {
            await sendEmail(email, 'Verify your Startives Account', verificationCode);
        } catch (err) {
            console.error('Email failed:', err.message);
        }

        // ✅ FIX: Return token + user
        return res.status(201).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name || '',
                    email: user.email,
                    headline: user.headline,
                    country: user.country,
                    profilePictureUrl: user.profilePictureUrl,
                    savedProjectIds: user.savedProjectIds || [],
                    connections: user.connections || [],
                    connectionRequests: user.connectionRequests || [],
                    sentRequests: user.sentRequests || [],
                    createdAt: user.createdAt,
                },
                token: generateToken(user._id),
            });
        }

        return res.status(401).json({ success: false, message: 'Invalid email or password' });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user && req.user._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = req.body.name ?? user.name;
        user.email = req.body.email ?? user.email;
        user.headline = req.body.headline ?? user.headline;
        user.bio = req.body.bio ?? user.bio;
        user.country = req.body.country ?? user.country;
        user.skills = req.body.skills ?? user.skills;
        user.interests = req.body.interests ?? user.interests;
        user.socialLinks = req.body.socialLinks ?? user.socialLinks;

        if (req.body.profilePictureUrl) {
            user.profilePictureUrl = req.body.profilePictureUrl;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        return res.json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                headline: updatedUser.headline,
                bio: updatedUser.bio,
                country: updatedUser.country,
                profilePictureUrl: updatedUser.profilePictureUrl,
                skills: updatedUser.skills,
                interests: updatedUser.interests,
                socialLinks: updatedUser.socialLinks,
                savedProjectIds: updatedUser.savedProjectIds,
            },
            token: generateToken(updatedUser._id),
        });

    } catch (error) {
        console.error('Profile Update Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get specific user by ID (Public)
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({
            success: true,
            user: {
                id: user._id,
                ...user.toObject(),
            },
        });

    } catch (error) {
        console.error('Get User Error:', error);
        return res.status(500).json({ success: false, message: 'Invalid User ID' });
    }
};

// @desc    Save or unsave a project
// @route   PUT /api/auth/save-project
const toggleSavedProject = async (req, res) => {
    try {
        const { projectId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const index = user.savedProjectIds.indexOf(projectId);

        if (index === -1) {
            user.savedProjectIds.push(projectId);
        } else {
            user.savedProjectIds.splice(index, 1);
        }

        await user.save();

        return res.json({
            success: true,
            savedProjectIds: user.savedProjectIds,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    toggleSavedProject,
    getUserById,
};