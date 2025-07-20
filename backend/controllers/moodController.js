// backend/controllers/moodController.js
import Mood from '../models/Mood.js';

export const addMood = async (req, res) => {
  try {
    // Use the correct property from JWT payload
    const userId = req.user.userId;
    const { mood, note } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    const moodEntry = new Mood({
      user: userId, // Correctly assign user
      mood,
      note,
    });

    await moodEntry.save();

    res.status(201).json({ message: 'Mood entry added successfully', mood: moodEntry });
  } catch (err) {
    console.error('Error adding mood:', err); // Log error for debugging
    res.status(500).json({ message: 'Server error while adding mood' });
  }
};

export const getUserMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.params.userId }).sort({ timestamp: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching moods' });
  }
};
