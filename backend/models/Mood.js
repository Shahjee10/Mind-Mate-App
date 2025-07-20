import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Reference to User collection
    required: true 
  },
  mood: { 
    type: String, 
    required: true 
  },
  note: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Mood = mongoose.model('Mood', moodSchema);

export default Mood;
