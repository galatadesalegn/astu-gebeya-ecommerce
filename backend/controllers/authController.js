import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validator from 'validator';
import sendEmail from '../utils/sendEmail.js';

// Generate access token (short-lived)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Generate refresh token (longer-lived)
const generateRefreshToken = (id) => {
    return jwt.sign({ id, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ─────────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // ── Input Validation ──
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' });
        }

        const sanitizedName = validator.escape(name.trim());

        // ── CRITICAL: Block Admin role self-assignment ──
        const allowedRoles = ['Buyer', 'Seller'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Choose Buyer or Seller.' });
        }

        // ── Check duplicate email ──
        const userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // ── Create user ──
        const user = await User.create({
            name: sanitizedName,
            email: email.toLowerCase().trim(),
            password,
            role,
            emailVerified: false, // Explicitly set to false
        });

        // ── Generate OTP ──
        const otp = user.generateOTP();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await user.save({ validateBeforeSave: false });

        // ── Send OTP email asynchronously (don't block registration) ──
        sendEmail({
            to: user.email,
            subject: 'ASTU Gebeya - Your Verification Code',
            templateParams: { otp, name: sanitizedName, time: expirationTime }, // Pass otp, name, and time
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <h2 style="color: #1e293b; font-weight: 900; text-align: center;">Verify Your Email</h2>
                    <p style="color: #64748b; font-size: 16px; text-align: center;">Hi <strong>${sanitizedName}</strong>,</p>
                    <p style="color: #64748b; font-size: 16px; text-align: center;">Use the code below to verify your account. This code expires in 10 minutes.</p>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center; margin: 30px 0;">
                        <span style="font-family: Courier New, Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #f97316;">${otp}</span>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't register at ASTU Gebeya, please ignore this email.</p>
                </div>
            `,
        }).catch(emailError => console.error('Email send failed:', emailError && emailError.message));

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: false,
            // token: generateToken(user._id), // REMOVED: Do not give token until verified
            // refreshToken: generateRefreshToken(user._id), // REMOVED: Do not give token until verified
            message: 'Registration successful! A 6-digit verification code has been sent to your email.',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// VERIFY OTP
// ─────────────────────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            otp: hashedOTP,
            otpExpiresAt: { $gt: Date.now() },
        }).select('+otp +otpExpiresAt');

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark as verified
        user.emailVerified = true;
        user.isVerified = true; // Sync for backward compatibility
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save({ validateBeforeSave: false });

        res.json({
            message: 'Email verified successfully! You can now log in.',
            emailVerified: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// RESEND VERIFICATION EMAIL
// ─────────────────────────────────────────────────────────────
export const resendVerification = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            // Don't reveal whether email exists
            return res.json({ message: 'If your email is registered, a verification link has been sent.' });
        }

        if (user.emailVerified || user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const otp = user.generateOTP();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await user.save({ validateBeforeSave: false });

        sendEmail({
            to: user.email,
            subject: 'ASTU Gebeya - Your Verification Code',
            templateParams: { otp, name: user.name, time: expirationTime }, // Pass otp, name, and time
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <h2 style="color: #1e293b; font-weight: 900; text-align: center;">Verification Code</h2>
                    <p style="color: #64748b; font-size: 16px; text-align: center;">Use the code below to verify your account. This code expires in 10 minutes.</p>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center; margin: 30px 0;">
                        <span style="font-family: Courier New, Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #f97316;">${otp}</span>
                    </div>
                </div>
            `,
        }).catch(emailError => console.error('Email send failed:', emailError && emailError.message));

        res.json({ message: 'If your email is registered, a verification code has been sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ── Input Validation ──
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // ── Check account lock ──
        if (user.isLocked()) {
            const lockMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(423).json({
                message: `Account temporarily locked due to too many failed attempts. Try again in ${lockMinutes} minute(s).`,
            });
        }

        // ── Check banned/suspended ──
        if (user.isBanned) {
            return res.status(403).json({ message: 'Your account has been banned. Contact support.' });
        }
        if (user.isSuspended) {
            return res.status(403).json({ message: 'Your account has been suspended. Contact support.' });
        }

        // ── Verify password ──
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            await user.incrementLoginAttempts();
            const remaining = Math.max(0, 5 - (user.loginAttempts + 1));
            return res.status(401).json({
                message: `Invalid email or password${remaining <= 2 ? `. ${remaining} attempt(s) remaining before lockout.` : ''}`,
            });
        }

        // ── Reset login attempts on success ──
        if (user.loginAttempts > 0) {
            await user.resetLoginAttempts();
        }

        // ── Block Unverified Users ──
        if (!user.emailVerified) {
            return res.status(403).json({
                message: 'Please verify your email address before logging in.',
                emailVerified: false,
                email: user.email // Helpful for frontend to redirect to OTP page
            });
        }



        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            adminRole: user.adminRole,
            isVerified: user.isVerified,
            emailVerified: user.emailVerified,
            token: generateToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// REFRESH TOKEN
// ─────────────────────────────────────────────────────────────
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        if (decoded.type !== 'refresh') {
            return res.status(401).json({ message: 'Invalid token type' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.isBanned || user.isSuspended) {
            return res.status(403).json({ message: 'Account is not active' });
        }

        res.json({
            token: generateToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired. Please log in again.' });
        }
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

// ─────────────────────────────────────────────────────────────
// FORGOT PASSWORD (OTP)
// ─────────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ message: 'If the email is registered, a password recovery code has been sent.' });
        }

        const otp = user.generateResetOTP();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await user.save({ validateBeforeSave: false });

        // send recovery email asynchronously
        sendEmail({
            to: user.email,
            subject: 'ASTU Gebeya - Password Recovery Code',
            templateParams: { otp, name: user.name, time: expirationTime }, // Pass otp, name, and time
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <h2 style="color: #1e293b; font-weight: 900; text-align: center;">Password Recovery</h2>
                    <p style="color: #64748b; font-size: 16px; text-align: center;">Hi <strong>${user.name}</strong>,</p>
                    <p style="color: #64748b; font-size: 16px; text-align: center;">You requested to reset your password. Use the verification code below to proceed. This code expires in 10 minutes.</p>
                    
                    <div style="background: #fff7ed; padding: 24px; border-radius: 12px; text-align: center; margin: 30px 0; border: 1px solid #fed7aa;">
                        <span style="font-family: Courier New, Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #f97316;">${otp}</span>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't request this, please secure your account.</p>
                </div>
            `,
        }).catch(emailError => console.error('Email send failed:', emailError && emailError.message));

        res.json({ message: 'If the email is registered, a password recovery code has been sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// VERIFY RESET OTP
// ─────────────────────────────────────────────────────────────
export const verifyResetOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            resetPasswordOTP: hashedOTP,
            resetPasswordOTPExpire: { $gt: Date.now() },
        }).select('+resetPasswordOTP +resetPasswordOTPExpire');

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired recovery code' });
        }

        res.json({ message: 'Recovery code verified. You can now set a new password.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// RESET PASSWORD (USING OTP)
// ─────────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        if (!email || !otp || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' });
        }

        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            resetPasswordOTP: hashedOTP,
            resetPasswordOTPExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired recovery code' });
        }

        user.password = password;
        // ── Invalidate OTP ──
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        // ── Also clear old token if any ──
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        res.json({ message: 'Password reset successful! You can now log in with your new password.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
