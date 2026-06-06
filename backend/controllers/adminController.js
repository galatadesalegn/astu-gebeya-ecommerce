import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// ─────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────────────────────
export const getStats = async (req, res) => {
    try {
        const [userCount, productCount, orderCount, pendingProducts, totalSales, recentOrders, ordersByStatus] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Product.countDocuments({ status: 'pending' }),
            Order.aggregate([
                { $match: { isPaid: true } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } },
            ]),
            Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name'),
            Order.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
        ]);

        const statusBreakdown = {};
        ordersByStatus.forEach(s => { statusBreakdown[s._id] = s.count; });

        res.json({
            users: userCount,
            products: productCount,
            orders: orderCount,
            pendingProducts,
            revenue: totalSales[0]?.total || 0,
            recentOrders,
            ordersByStatus: statusBreakdown,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────────────────────
export const getUsers = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
            User.countDocuments(),
        ]);

        res.json({ users, page, totalPages: Math.ceil(total / limit), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent modifying role to invalid values
        if (req.body.role) {
            const allowedRoles = ['Buyer', 'Seller', 'Admin'];
            if (!allowedRoles.includes(req.body.role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        const updatedUser = await user.save();

        // Return without password
        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleVerification = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isVerified = !user.isVerified;
        user.emailVerified = user.isVerified;
        // Clear verification tokens/codes when admin manually verifies
        if (user.isVerified) {
            user.verificationToken = undefined;
            user.verificationTokenExpire = undefined;
            user.otp = undefined;
            user.otpExpiresAt = undefined;
        }
        await user.save({ validateBeforeSave: false });

        const userResponse = user.toObject();
        delete userResponse.password;
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleSuspension = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'Admin') {
            return res.status(403).json({ message: 'Cannot suspend an admin account' });
        }
        user.isSuspended = !user.isSuspended;
        await user.save({ validateBeforeSave: false });

        const userResponse = user.toObject();
        delete userResponse.password;
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleBan = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'Admin') {
            return res.status(403).json({ message: 'Cannot ban an admin account' });
        }
        user.isBanned = !user.isBanned;
        await user.save({ validateBeforeSave: false });

        const userResponse = user.toObject();
        delete userResponse.password;
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'Admin') {
            return res.status(403).json({ message: 'Cannot delete an admin account' });
        }
        await user.deleteOne();
        res.json({ message: 'User permanently removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// PRODUCT MANAGEMENT
// ─────────────────────────────────────────────────────────────
export const getProducts = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) {
            const validStatuses = ['pending', 'approved', 'rejected'];
            if (validStatuses.includes(req.query.status)) {
                filter.status = req.query.status;
            }
        }

        const [products, total] = await Promise.all([
            Product.find(filter).populate('seller', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product.countDocuments(filter),
        ]);

        res.json({ products, page, totalPages: Math.ceil(total / limit), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProductStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // ── Validate status value ──
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.status = status;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// ORDER MANAGEMENT (Admin)
// ─────────────────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.isPaid !== undefined) {
            filter.isPaid = req.query.isPaid === 'true';
        }

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate('user', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Order.countDocuments(filter),
        ]);

        res.json({ orders, page, totalPages: Math.ceil(total / limit), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// INVENTORY CONTROL (Admin)
// ─────────────────────────────────────────────────────────────
export const getInventory = async (req, res) => {
    try {
        const lowStockThreshold = parseInt(req.query.lowStock) || 5;

        const [totalProducts, lowStockProducts, outOfStockProducts, inventory] = await Promise.all([
            Product.countDocuments({ status: 'approved' }),
            Product.countDocuments({ status: 'approved', stock: { $gt: 0, $lte: lowStockThreshold } }),
            Product.countDocuments({ status: 'approved', stock: 0 }),
            Product.find({ status: 'approved' })
                .select('title stock price category seller image')
                .populate('seller', 'name')
                .sort({ stock: 1 })
                .limit(100),
        ]);

        res.json({
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
            inventory,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProductStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const numericStock = parseInt(stock);

        if (isNaN(numericStock) || numericStock < 0) {
            return res.status(400).json({ message: 'Stock must be a non-negative integer' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.stock = numericStock;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// CHAT MANAGEMENT
// ─────────────────────────────────────────────────────────────
export const getAllChats = async (req, res) => {
    try {
        const chats = await Conversation.find()
            .populate('participants', 'name email role isVerified')
            .populate('product', 'title image price')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleChatFlag = async (req, res) => {
    try {
        const chat = await Conversation.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        chat.isFlagged = !chat.isFlagged;
        await chat.save();
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const flagContent = async (req, res) => {
    try {
        const { type, id } = req.body;
        if (!type || !id) {
            return res.status(400).json({ message: 'Content type and ID are required' });
        }

        if (type === 'product') {
            const product = await Product.findById(id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            product.isFlagged = !product.isFlagged;
            await product.save();
            return res.json({ message: `Product ${product.isFlagged ? 'flagged' : 'unflagged'}`, product });
        }

        if (type === 'chat') {
            const chat = await Conversation.findById(id);
            if (!chat) return res.status(404).json({ message: 'Chat not found' });
            chat.isFlagged = !chat.isFlagged;
            await chat.save();
            return res.json({ message: `Chat ${chat.isFlagged ? 'flagged' : 'unflagged'}`, chat });
        }

        res.status(400).json({ message: 'Invalid content type. Use "product" or "chat".' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ─────────────────────────────────────────────────────────────
// ADMIN ACCOUNT MANAGEMENT
// ─────────────────────────────────────────────────────────────
export const updateAdminEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const admin = await User.findById(req.user._id);
        if (!admin || admin.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        admin.email = email.toLowerCase().trim();
        await admin.save();

        res.json({ message: 'Admin email updated successfully', email: admin.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAdminPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Both old and new passwords are required' });
        }

        const admin = await User.findById(req.user._id).select('+password');
        if (!admin || admin.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const isMatch = await admin.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters' });
        }

        admin.password = newPassword;
        await admin.save();

        res.json({ message: 'Admin password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// STAFF INVITATION AND RBAC (Super Admin Only)
// ─────────────────────────────────────────────────────────────
export const getStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: 'Admin' }).select('-password -otp -verificationToken -resetPasswordToken');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createStaff = async (req, res) => {
    try {
        const { name, email, password, adminRole } = req.body;
        if (!name || !email || !password || !adminRole) {
            return res.status(400).json({ message: 'Please provide name, email, password, and adminRole' });
        }

        const validRoles = ['Super Admin', 'Editor', 'Viewer'];
        if (!validRoles.includes(adminRole)) {
            return res.status(400).json({ message: 'Invalid adminRole. Must be Super Admin, Editor, or Viewer.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const staffMember = await User.create({
            name,
            email,
            password,
            role: 'Admin',
            adminRole,
            isVerified: true, // Auto-verify internal staff creation
            emailVerified: true
        });

        const staffResponse = staffMember.toObject();
        delete staffResponse.password;
        res.status(201).json(staffResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStaffRole = async (req, res) => {
    try {
        const { adminRole } = req.body;
        const validRoles = ['Super Admin', 'Editor', 'Viewer'];
        if (!validRoles.includes(adminRole)) {
            return res.status(400).json({ message: 'Invalid adminRole. Must be Super Admin, Editor, or Viewer.' });
        }

        const staffMember = await User.findById(req.params.id);
        if (!staffMember || staffMember.role !== 'Admin') {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        // Prevent modifying own role down or getting locked out
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot change your own role' });
        }

        staffMember.adminRole = adminRole;
        await staffMember.save();

        const staffResponse = staffMember.toObject();
        delete staffResponse.password;
        res.json(staffResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeStaff = async (req, res) => {
    try {
        const staffMember = await User.findById(req.params.id);
        if (!staffMember || staffMember.role !== 'Admin') {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }

        await staffMember.deleteOne();
        res.json({ message: 'Staff member fully removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
