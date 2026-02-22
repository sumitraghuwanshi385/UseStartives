// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load env FIRST
dotenv.config();

// DB
const connectDB = require('./config/db');
connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const startalkRoutes = require('./routes/startalkRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// ===== MIDDLEWARES =====
const allowedOrigins = [
  process.env.FRONTEND_URL,       // e.g. https://startives.vercel.app
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Postman/Server-to-server requests (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Preflight
app.options('*', cors());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== ROUTES =====
app.get('/', (req, res) => {
  res.send('Startives API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/startalks', startalkRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// ===== SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});