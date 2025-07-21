import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  refreshToken
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Role-specific login routes for clarity
router.post('/admin/login', validateLogin, login);
router.post('/gym-owner/login', validateLogin, login);
router.post('/instructor/login', validateLogin, login);
router.post('/customer/login', validateLogin, login);

export default router;