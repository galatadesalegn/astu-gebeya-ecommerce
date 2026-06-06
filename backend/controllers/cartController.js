import User from '../models/User.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cartItems.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sync user cart
// @route   POST /api/cart
// @access  Private
export const syncCart = async (req, res) => {
    try {
        const { cartItems } = req.body; // Expects array of { product: id, qty: number }

        if (!Array.isArray(cartItems)) {
            return res.status(400).json({ message: 'Invalid cart data' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cartItems = cartItems.map(item => ({
            product: item.product || item._id, // Handle different formats
            qty: item.qty || item.quantity || 1
        }));

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cartItems = [];
        await user.save();
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
