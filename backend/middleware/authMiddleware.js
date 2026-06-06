import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'User no longer exists' });
            }

            // Check if user is suspended or banned
            if (user.isBanned) {
                return res.status(403).json({ message: 'Your account has been banned. Contact support.' });
            }
            if (user.isSuspended) {
                return res.status(403).json({ message: 'Your account has been suspended. Contact support.' });
            }

            req.user = user;
            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired. Please log in again.' });
            }
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to ensure email is verified
export const verifiedOnly = (req, res, next) => {
    if (req.user && req.user.isVerified) {
        next();
    } else {
        res.status(403).json({
            message: 'Please verify your email address before performing this action.',
            requiresVerification: true,
        });
    }
};

export const sellerOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'Seller' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a seller' });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export const superAdminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin' && req.user.adminRole === 'Super Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Requires Super Admin privileges' });
    }
};

export const editorOrSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin' && (req.user.adminRole === 'Super Admin' || req.user.adminRole === 'Editor')) {
        next();
    } else {
        res.status(403).json({ message: 'Requires Editor or Super Admin privileges' });
    }
};
