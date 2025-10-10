import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protectUser, getCurrentUser);

export default router;
