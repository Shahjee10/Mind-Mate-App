import User from '../models/User.js';
import Otp from '../models/Otp.js';
import bcrypt from 'bcrypt';

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email, provider: 'manual' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Reuse OTP sending logic from otpController or implement here
    // For brevity, you could call sendOtp function or duplicate code here
    
    // We'll assume you call the sendOtp route from frontend before this or combine logic

    res.json({ message: 'Password reset OTP sent if user exists' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during password reset request' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });

  try {
    const otpRecord = await Otp.findOne({ email, otp, used: false });
    if (!otpRecord)
      return res.status(400).json({ message: 'Invalid OTP' });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: 'OTP expired' });

    const user = await User.findOne({ email, provider: 'manual' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    otpRecord.used = true;
    await otpRecord.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Password reset failed' });
  }
};
