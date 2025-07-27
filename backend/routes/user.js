import express from 'express';
import { uploadAvatar } from '../controllers/userController.js';
import { authenticateToken } from './auth.js'; // or extract to a separate middleware file

const router = express.Router();

// Use authenticateToken middleware to protect this route
router.post('/upload-avatar', authenticateToken, uploadAvatar);

export default router;

