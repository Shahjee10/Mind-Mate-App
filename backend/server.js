import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import auth from './routes/auth.js';  // import your auth routes
import { addMood, getUserMoods } from './controllers/moodController.js';
import verifyToken from './middleware/verifyToken.js'; // ✅ CORRECT
import aiRoutes from './routes/ai.js';


dotenv.config();

// Debug: Check env variables loaded properly
console.log('Loaded EMAIL_USER:', process.env.EMAIL_USER);
console.log('Loaded EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'No pass');

const app = express();

// CORS configuration for development
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:19006',
    'http://192.168.1.100:3000',
    'http://192.168.1.100:19006',
    'http://192.168.100.21:3000',
    'http://192.168.100.21:19006',
    'exp://192.168.1.100:19000',
    'exp://192.168.100.21:8081',
    'https://auth.expo.io',
    'http://localhost:19000',
    'exp://localhost:19000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('MindMate API is working!');
});

// Use auth routes
app.use('/api/auth', auth);

app.use('/api/ai', aiRoutes);


const router = express.Router();

router.post('/add', verifyToken, addMood);
router.get('/:userId', verifyToken, getUserMoods);

export const moodRoutes = router;
app.use('/api/moods', moodRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Accessible at: http://192.168.100.21:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

  
