// backend/routes/moodRoutes.js
const express = require('express');
const router = express.Router();
const { addMood, getUserMoods } = require('../controllers/moodController');
const verifyToken = require('../middleware/verifyToken');

router.post('/add', verifyToken, addMood);
router.get('/:userId', verifyToken, getUserMoods);

module.exports = router;
