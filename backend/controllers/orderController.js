import Order from '../models/Order.js';
import Product from '../models/Product.js';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────
// CREATE ORDER — Server-side price calculation, stock validation
// ─────────────────────────────────────────────────────────────
export const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, idempotencyKey } = req.body;

        // ── Validate order items ──
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        if (!shippingAddress || !shippingAddress.name || !shippingAddress.email ||
            !shippingAddress.phone || !shippingAddress.dormBlock || !shippingAddress.roomNumber) {
            return res.status(400).json({ message: 'Complete shipping address is required' });
        }

        // ── Duplicate order prevention via idempotency key ──
        const orderKey = idempotencyKey || crypto.randomBytes(16).toString('hex');
        const existingOrder = await Order.findOne({ idempotencyKey: orderKey });
        if (existingOrder) {
            return res.status(200).json(existingOrder); // Return existing order (idempotent)
        }

        // ── SERVER-SIDE PRICE CALCULATION — Never trust frontend prices ──
        let calculatedTotal = 0;
        const verifiedItems = [];

        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }



            // ── Stock validation ──
            const qty = Math.max(1, Math.floor(Number(item.qty)));
            if (product.stock < qty) {
                return res.status(400).json({
                    message: `Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${qty}`,
                });
            }

            calculatedTotal += product.price * qty;

            verifiedItems.push({
                title: product.title,
                qty,
                image: product.image,
                price: product.price, // Use DB price, NOT frontend price
                product: product._id,
                seller: product.seller,
            });
        }

        const taxPrice = 0; // Adjust if you have tax logic
        const shippingPrice = 0; // Adjust if you have shipping logic
        const totalPrice = calculatedTotal + taxPrice + shippingPrice;

        // ── Create order ──
        const order = new Order({
            orderItems: verifiedItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod: paymentMethod || 'Peer to Peer (Hand-to-Hand)',
            taxPrice,
            shippingPrice,
            totalPrice,
            idempotencyKey: orderKey,
            status: 'pending',
        });

        const createdOrder = await order.save();

        // ── Reduce stock for each ordered product ──
        for (const item of verifiedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.qty },
            });
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        // Handle duplicate idempotency key (race condition)
        if (error.code === 11000 && error.keyPattern?.idempotencyKey) {
            const existingOrder = await Order.findOne({ idempotencyKey: req.body.idempotencyKey });
            return res.status(200).json(existingOrder);
        }
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// GET ORDER BY ID — with ownership check
// ─────────────────────────────────────────────────────────────
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only the order owner, a seller in the order, or admin can view
        const isOwner = order.user._id.toString() === req.user._id.toString();
        const isSeller = order.orderItems.some(item => item.seller.toString() === req.user._id.toString());
        const isAdmin = req.user.role === 'Admin';

        if (!isOwner && !isSeller && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// CONFIRM ORDER PAYMENT — Only seller or admin can mark as paid
// ─────────────────────────────────────────────────────────────
export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // ── Authorization: Only a seller in the order or admin can confirm payment ──
        const isSeller = order.orderItems.some(item => item.seller.toString() === req.user._id.toString());
        const isAdmin = req.user.role === 'Admin';

        if (!isSeller && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to confirm payment for this order' });
        }

        // ── Immutability: Cannot modify already paid orders ──
        if (order.isPaid) {
            return res.status(400).json({ message: 'Order is already marked as paid' });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot mark a cancelled order as paid' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'paid';
        order.paymentReference = req.body.paymentReference || `MANUAL-${Date.now()}`;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// GET MY ORDERS (buyer)
// ─────────────────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            Order.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Order.countDocuments({ user: req.user._id }),
        ]);

        res.json({ orders, page, totalPages: Math.ceil(total / limit), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// GET SELLER ORDERS
// ─────────────────────────────────────────────────────────────
export const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'orderItems.seller': req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// GET SELLER STATS
// ─────────────────────────────────────────────────────────────
export const getSellerStats = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const orders = await Order.find({ 'orderItems.seller': sellerId });

        let totalRevenue = 0;
        let totalOrders = 0;
        const salesMap = {};

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (item.seller.toString() === sellerId.toString()) {
                    const revenue = item.price * item.qty;
                    totalRevenue += revenue;
                    totalOrders += 1;

                    const date = order.createdAt.toISOString().split('T')[0];
                    if (!salesMap[date]) salesMap[date] = 0;
                    salesMap[date] += revenue;
                }
            });
        });

        const salesData = Object.keys(salesMap).sort().map(date => ({
            date,
            revenue: salesMap[date],
        }));

        res.json({ totalRevenue, totalOrders, salesData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// MARK ORDER AS DELIVERED — Only seller or admin
// ─────────────────────────────────────────────────────────────
export const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // ── Authorization ──
        const isSeller = order.orderItems.some(item => item.seller.toString() === req.user._id.toString());
        const isAdmin = req.user.role === 'Admin';

        if (!isSeller && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update delivery status' });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot deliver a cancelled order' });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'delivered';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// CANCEL ORDER — Only buyer (if not yet paid) or admin
// ─────────────────────────────────────────────────────────────
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isOwner = order.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'Admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Buyer can only cancel unpaid orders
        if (isOwner && !isAdmin && order.isPaid) {
            return res.status(400).json({ message: 'Cannot cancel a paid order. Contact support for a refund.' });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        if (order.status === 'delivered') {
            return res.status(400).json({ message: 'Cannot cancel a delivered order' });
        }

        // ── Restore stock ──
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.qty },
            });
        }

        order.status = 'cancelled';
        order.cancelReason = req.body.reason || 'Cancelled by user';

        // If was paid, mark for refund
        if (order.isPaid) {
            order.status = 'refunded';
            order.refundAmount = order.totalPrice;
            order.refundedAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
// UPDATE ORDER STATUS — Admin only
// ─────────────────────────────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update related flags
        if (status === 'paid') {
            order.isPaid = true;
            order.paidAt = Date.now();
        }
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        if (status === 'cancelled' || status === 'refunded') {
            // Restore stock
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.qty },
                });
            }
            if (status === 'refunded') {
                order.refundAmount = order.totalPrice;
                order.refundedAt = Date.now();
            }
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
