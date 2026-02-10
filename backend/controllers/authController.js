// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// --- FIX: Generate Token Function (Inline) ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            email,
            password,
        });

        if (user) {
            let emailSuccess = false;
            try {
                // Email logic (Optional error handling)
                await sendEmail(email, 'Verify your Startives Account', verificationCode);
                emailSuccess = true;
            } catch (emailError) {
                console.error("Email sending failed:", emailError.message);
            }

            res.status(201).json({
                success: true,
                verificationCode: verificationCode,
                message: emailSuccess ? `Verification code sent to ${email}` : `User created. Code: ${verificationCode}`
            });

        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    headline: user.headline,
                    country: user.country,
                    profilePictureUrl: user.profilePictureUrl,
                    savedProjectIds: user.savedProjectIds,
                    connections: user.connections || [],
                    connectionRequests: user.connectionRequests || [],
                    sentRequests: user.sentRequests || [],
                    createdAt: user.createdAt,
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
    console.log("Update Profile Request:", req.body); 

    try {
        // ID check: req.body.id ya req.user._id dono check karo
        const userId = req.body.id || (req.user && req.user._id);

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const user = await User.findById(userId);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.headline = req.body.headline || user.headline;
            user.bio = req.body.bio || user.bio;
            user.country = req.body.country || user.country;
            user.skills = req.body.skills || user.skills;
            user.interests = req.body.interests || user.interests;
            user.socialLinks = req.body.socialLinks || user.socialLinks;

            // ✅ FIX: Profile Picture (Handle both names)
            if (req.body.profilePictureUrl) {
                user.profilePictureUrl = req.body.profilePictureUrl;
            } else if (req.body.avatar) {
                user.profilePictureUrl = req.body.avatar;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            console.log("Profile Updated ✅");

            res.json({
                success: true,
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    headline: updatedUser.headline,
                    bio: updatedUser.bio,
                    country: updatedUser.country,
                    profilePictureUrl: updatedUser.profilePictureUrl, // Ab ye updated wala jayega
                    skills: updatedUser.skills,
                    interests: updatedUser.interests,
                    socialLinks: updatedUser.socialLinks,
                    savedProjectIds: updatedUser.savedProjectIds,
                },
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile Update Error:", error); 
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Specific User by ID (Public)
// @route   GET /api/users/:id 
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); 

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userObj = user.toObject();
    userObj.id = userObj._id.toString();
    delete userObj._id;
    delete userObj.__v;
    delete userObj.password;

    return res.json({ success: true, user: userObj });
  } catch (err) {
    console.error("Get User Error:", err);
    return res.status(500).json({ success: false, message: "Invalid User ID" });
  }
};

// @desc    Save or Unsave a Project
// @route   PUT /api/auth/save-project
const toggleSavedProject = async (req, res) => {
    try {
        const { projectId } = req.body;
        // Check for user existence
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const index = user.savedProjectIds.indexOf(projectId);

        if (index === -1) {
            user.savedProjectIds.push(projectId);
            await user.save();
            res.json({ success: true, message: 'Project saved', savedProjectIds: user.savedProjectIds });
        } else {
            user.savedProjectIds.splice(index, 1);
            await user.save();
            res.json({ success: true, message: 'Project removed', savedProjectIds: user.savedProjectIds });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    toggleSavedProject, 
    getUserById 
};