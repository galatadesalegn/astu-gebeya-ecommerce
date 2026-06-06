import express from 'express';
import {
    registerUser,
    loginUser,
    verifyOTP,
    resendVerification,
    refreshToken,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
} from '../controllers/authController.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Auth routes with rate limiting
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/verify-otp', authLimiter, verifyOTP);
router.post('/resend-verification', authLimiter, resendVerification);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/verify-reset-otp', passwordResetLimiter, verifyResetOTP);
router.post('/reset-password', passwordResetLimiter, resetPassword);

export default router;
