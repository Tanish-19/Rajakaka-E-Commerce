// routes/adminRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  login,
  register,
  verifyToken,
  getProfile
} from '../controllers/adminController.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/verify', authMiddleware, verifyToken);
router.get('/profile', authMiddleware, getProfile);

export default router;