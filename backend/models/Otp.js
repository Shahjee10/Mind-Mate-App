import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  purpose: { type: String, required: true, enum: ['signup', 'reset', 'login'] }  // Added purpose field
});

export default mongoose.model('Otp', otpSchema);
