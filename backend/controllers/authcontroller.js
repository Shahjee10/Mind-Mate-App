import axios from 'axios';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendOtpToEmail } from './otpController.js';  // Updated import
import Otp from '../models/Otp.js'; // Added import for Otp model


export const githubLogin = async (req, res) => {
  const { code, code_verifier } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }

  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.error('GitHub OAuth Error: Missing environment variables');
    return res.status(500).json({ message: 'GitHub OAuth configuration error' });
  }

  try {
    // Prepare the request body for token exchange
    const tokenRequestBody = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    };

    // Add code_verifier if present (for PKCE)
    if (code_verifier) {
      tokenRequestBody.code_verifier = code_verifier;
    }

    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      tokenRequestBody,
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      console.error('GitHub OAuth Error: No access token received');
      return res.status(400).json({ message: 'Failed to get access token' });
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });

    const { id: providerId, login: username, avatar_url: avatar, email } = userResponse.data;

    let userEmail = email;
    if (!userEmail) {
      const emailsRes = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${accessToken}` },
      });
      const primaryEmailObj = emailsRes.data.find(e => e.primary && e.verified);
      userEmail = primaryEmailObj?.email || null;
    }

    let user = await User.findOne({ providerId: providerId.toString(), provider: 'github' });
    if (!user) {
      user = await User.create({
        providerId: providerId.toString(),
        provider: 'github',
        email: userEmail,
        name: username,
        avatar,
        isVerified: true, // Set isVerified true for OAuth users
      });
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token: jwtToken,
      user: { email: user.email, name: user.name, avatar: user.avatar },
    });
  } catch (error) {
    console.error('GitHub OAuth Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'GitHub login failed' });
  }
};

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      // Send OTP first before creating user
      try {
        await sendOtpToEmail(email, 'signup');
        res.status(200).json({ 
          message: 'OTP sent to your email. Please verify to complete registration.',
          success: true,
          requiresOtpVerification: true
        });
      } catch (otpError) {
        console.error('OTP sending failed:', otpError.message);
        res.status(500).json({ 
          message: 'Failed to send OTP. Please try again.',
          error: otpError.message
        });
      }
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Server error during signup' });
    }
  };

// New function to complete signup after OTP verification
export const completeSignup = async (req, res) => {
  const { email, password, name, otp } = req.body;

  if (!email || !password || !otp) {
    return res.status(400).json({ message: 'Email, password, and OTP are required' });
  }

  try {
    // Verify OTP first
    const otpRecord = await Otp.findOne({ email, otp, used: false, purpose: 'signup' });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      provider: 'manual',
      isVerified: true, // User is verified since OTP is verified
    });

    await user.save();

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      message: 'User registered successfully!',
      success: true,
      token,
      user: { email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('Complete signup error:', err);
    res.status(500).json({ message: 'Server error during signup completion' });
  }
};

// Password reset request
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email, provider: 'manual' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send OTP for password reset
    try {
      await sendOtpToEmail(email, 'reset');
      res.json({ 
        message: 'Password reset OTP sent to your email.',
        success: true
      });
    } catch (otpError) {
      console.error('Password reset OTP failed:', otpError.message);
      res.status(500).json({ 
        message: 'Failed to send password reset OTP.',
        error: otpError.message
      });
    }
  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

// Reset password with OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  try {
    // Verify OTP
    const otpRecord = await Otp.findOne({ email, otp, used: false, purpose: 'reset' });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Find user
    const user = await User.findOne({ email, provider: 'manual' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    res.json({ 
      message: 'Password reset successfully!',
      success: true
    });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email, provider: 'manual' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
