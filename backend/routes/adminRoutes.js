import express from 'express';
const router = express.Router();
import {
    getStats,
    getUsers,
    updateUser,
    toggleVerification,
    toggleSuspension,
    toggleBan,
    deleteUser,
    getProducts,
    updateProductStatus,
    updateProductStock,
    getAllOrders,
    getInventory,
    getAllChats,
    toggleChatFlag,
    flagContent,
    updateAdminEmail,
    updateAdminPassword,
    getStaff,
    createStaff,
    updateStaffRole,
    removeStaff,
} from '../controllers/adminController.js';
import { updateOrderStatus } from '../controllers/orderController.js';
import { deleteProduct } from '../controllers/productController.js';
import { protect, adminOnly, superAdminOnly } from '../middleware/authMiddleware.js';

// All admin routes require auth + admin role
router.use(protect);
router.use(adminOnly);

// Account Settings
router.put('/account/email', updateAdminEmail);
router.put('/account/password', updateAdminPassword);

// Dashboard
router.get('/stats', getStats);

// User management
router.get('/users', getUsers);
router.put('/user/:id', updateUser);
router.put('/user/:id/verify', toggleVerification);
router.put('/user/:id/suspend', toggleSuspension);
router.put('/user/:id/ban', toggleBan);
router.delete('/user/:id', deleteUser);

// Product management
router.get('/products', getProducts);
router.put('/product/:id/status', updateProductStatus);
router.put('/product/:id/stock', updateProductStock);
router.delete('/product/:id', deleteProduct);

// Order management
router.get('/orders', getAllOrders);
router.put('/order/:id/status', updateOrderStatus);

// Inventory
router.get('/inventory', getInventory);

// Chat management
router.get('/chats', getAllChats);
router.put('/chat/:id/flag', toggleChatFlag);
router.post('/flag', flagContent);

// Staff management
router.get('/staff', superAdminOnly, getStaff);
router.post('/staff', superAdminOnly, createStaff);
router.put('/staff/:id/role', superAdminOnly, updateStaffRole);
router.delete('/staff/:id', superAdminOnly, removeStaff);

export default router;
