import express from 'express';
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getSellerStats,
    getSellerOrders,
    updateOrderToDelivered,
    cancelOrder,
} from '../controllers/orderController.js';
import { protect, verifiedOnly } from '../middleware/authMiddleware.js';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Orders require auth
router.post('/', protect, orderLimiter, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/seller/stats', protect, getSellerStats);
router.get('/seller/orders', protect, getSellerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, updateOrderToDelivered);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
