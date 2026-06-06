import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect, sellerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sellerOnly, (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).json({ message: err.message || 'Upload failed' });
        }
        if (req.file) {
            res.json({ url: req.file.path });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    });
});

export default router;
