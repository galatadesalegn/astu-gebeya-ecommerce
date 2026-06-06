import express from 'express';
import { getProducts, createProduct, getSellerProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, sellerOnly, verifiedOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, sellerOnly, createProduct);
router.get('/seller/listings', protect, sellerOnly, getSellerProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, sellerOnly, updateProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);

export default router;
