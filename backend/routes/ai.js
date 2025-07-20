import express from 'express';
import { chatWithMindMate } from '../controllers/aiController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/chat', verifyToken, chatWithMindMate);

export default router;
