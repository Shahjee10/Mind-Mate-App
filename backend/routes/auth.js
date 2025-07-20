import express from 'express';
import { signup, login, githubLogin, completeSignup, requestPasswordReset, resetPassword } from '../controllers/authcontroller.js';
import { sendOtp, verifyOtp } from '../controllers/otpController.js';

const router = express.Router();

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

export default router;
