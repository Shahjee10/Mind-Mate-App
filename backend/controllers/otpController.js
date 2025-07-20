import Otp from '../models/Otp.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create email transporter function
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Internal function to send OTP (can be called from other controllers)
export const sendOtpToEmail = async (email, purpose = 'signup') => {
  if (!email) throw new Error('Email is required');

  // Check if email configuration is set up
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS environment variables.');
  }

  try {
    // Create fresh transporter and verify email connection
    const transporter = createTransporter();
    await transporter.verify();

    // Generate OTP and expiry (10 minutes)
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP in DB (invalidate any previous OTP for this email and purpose)
    await Otp.updateMany({ email, purpose, used: false }, { used: true });

    const otpEntry = new Otp({ 
      email, 
      otp: otpCode, 
      expiresAt,
      purpose: purpose
    });
    await otpEntry.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otpCode}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'OTP sent to email' };
  } catch (err) {
    console.error('OTP Error:', err.message);
    if (err.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your email credentials.');
    } else if (err.code === 'ECONNECTION') {
      throw new Error('Could not connect to email server. Please check your internet connection.');
    } else {
      throw new Error(`Error sending OTP: ${err.message}`);
    }
  }
};

// API route function for sending OTP
export const sendOtp = async (req, res) => {
  const { email, purpose = 'signup' } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    await sendOtpToEmail(email, purpose);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp, purpose = 'signup' } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: 'Email and OTP are required' });

  try {
    const otpRecord = await Otp.findOne({ email, otp, used: false, purpose });

    if (!otpRecord)
      return res.status(400).json({ message: 'Invalid OTP' });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: 'OTP expired' });

    // Mark OTP as used to prevent reuse
    otpRecord.used = true;
    await otpRecord.save();

    res.json({ message: 'OTP verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};
