// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token nikalo ("Bearer token123..." -> "token123...")
            token = req.headers.authorization.split(' ')[1];

            // Token decode karo
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // User dhoondho aur request me attach kar do
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Aage badho
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

module.exports = { protect };