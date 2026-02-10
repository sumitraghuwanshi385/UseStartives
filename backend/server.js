// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const startalkRoutes = require('./routes/startalkRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const path = require('path');
const chatRoutes = require('./routes/chatRoutes');
// Config load
dotenv.config();

// Database connect
connectDB();

const app = express();

// --- YE SETTINGS BAHUT ZAROORI HAIN (Photo upload ke liye) ---
// Isse 100MB tak ka data allow hoga
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());
// -----------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/startalks', startalkRoutes); 
app.use('/api/connections', connectionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Test Route
app.get('/', (req, res) => {
    res.send('Startives API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);
const PORT = process.env.PORT || 5000;

app.use('/api/chat', chatRoutes);  // ✅ Ensure this path matches frontend API calls

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});