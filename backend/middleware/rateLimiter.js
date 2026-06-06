import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window per IP
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for auth routes (login, register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window per IP
    message: { message: 'Too many authentication attempts, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for password reset requests
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour per IP
    message: { message: 'Too many password reset requests, please try again after 1 hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limiter for order placement
export const orderLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 orders per minute per IP
    message: { message: 'Too many orders placed, please wait a moment.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limiter for verification resend
export const verificationResendLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: { message: 'Too many verification requests. Please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});
