const express = require('express');
const router = express.Router();
const { addMood, getUserMoods, getMoodHistory } = require('../controllers/moodController');
const verifyToken = require('../middleware/verifyToken');

// Add mood
router.post('/add', verifyToken, addMood);

// Get current user's moods
router.get('/', verifyToken, getUserMoods);

// Get current user's mood history
router.get('/history', verifyToken, getMoodHistory);

module.exports = router;
