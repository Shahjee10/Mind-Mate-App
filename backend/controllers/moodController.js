import Mood from '../models/Mood.js';

// Add mood (uses userId from token)
export const addMood = async (req, res) => {
  try {
    const userId = req.user.userId; // from token
    const { mood, note } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    const moodEntry = new Mood({
      user: userId,
      mood,
      note,
    });

    await moodEntry.save();

    res.status(201).json({ message: 'Mood entry added successfully', mood: moodEntry });
  } catch (err) {
    console.error('Error adding mood:', err);
    res.status(500).json({ message: 'Server error while adding mood' });
  }
};

// Get all moods for the authenticated user
export const getUserMoods = async (req, res) => {
  try {
    const userId = req.user.userId;  // from token
    const moods = await Mood.find({ user: userId }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    console.error('Error fetching user moods:', err);
    res.status(500).json({ error: 'Error fetching moods' });
  }
};

// Get mood history for the authenticated user
export const getMoodHistory = async (req, res) => {
  try {
    const userId = req.user.userId; // fixed from req.user.id

    const moodHistory = await Mood.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(moodHistory);
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
