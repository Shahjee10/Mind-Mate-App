import express from 'express';
import {
  signup,
  login,
  githubLogin,
  completeSignup,
  requestPasswordReset,
  resetPassword,
  updatePassword, // Import the new password update controller
} from '../controllers/authcontroller.js';
import { sendOtp, verifyOtp } from '../controllers/otpController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * Middleware to authenticate JWT tokens.
 * Verifies the token sent in Authorization header (Bearer token).
 * Adds the decoded user info to req.user.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Authorization header format: 'Bearer <token>'
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // user object contains userId, etc.
    next();
  });
};

// Authentication routes
router.post('/signup', signup);
router.post('/complete-signup', completeSignup);
router.post('/login', login);
router.post('/github', githubLogin);

// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// OTP routes
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);

// Protected route for updating password - requires authentication
router.put('/update-password', authenticateToken, updatePassword);

export { authenticateToken };

export default router;