// Importing required packages
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import os from 'os'; // ✅ Static import (fixes your error)

// Importing route handlers
import auth from './routes/auth.js';
import { addMood, getUserMoods } from './controllers/moodController.js';
import verifyToken from './middleware/verifyToken.js';
import aiRoutes from './routes/ai.js';
import userRoutes from './routes/User.js'; // for avatar/profile management

dotenv.config(); // Load environment variables from .env

// Debug logs to check environment variables are loading correctly
console.log('Loaded EMAIL_USER:', process.env.EMAIL_USER);
console.log('Loaded EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'No pass');

const app = express();

// CORS configuration - make sure it allows requests from your frontend IPs
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:19006',
    'http://192.168.100.21:3000',
    'http://192.168.100.21:19006',
    'exp://192.168.100.21:19000',
    'http://localhost:19000',
    'exp://localhost:19000',
    'https://auth.expo.io'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // For serving uploaded profile images

// Test API route
app.get('/', (req, res) => {
  res.send('MindMate API is working!');
});

// Routes
app.use('/api/auth', auth);             // Auth routes (signup, login, GitHub OAuth)
app.use('/api/users', userRoutes);      // User profile/avatar routes
app.use('/api/ai', aiRoutes);           // AI chat route

// Mood tracking routes
const router = express.Router();
router.post('/add', verifyToken, addMood);
router.get('/:userId', verifyToken, getUserMoods);
app.use('/api/moods', router); // Mount moods under /api/moods

// Determine local IP address to display in logs
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const localIP = getLocalIPAddress();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Accessible at: http://${localIP}:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
