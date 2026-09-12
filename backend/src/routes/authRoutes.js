import express from 'express';
import { register, login, getMe, updateTheme } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.patch('/theme', authenticateToken, updateTheme);

export default router;
