import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';
import validator from 'validator';

// Helper: Extract Cloudinary public_id from URL
const getPublicIdFromUrl = (url) => {
    try {
        const parts = url.split('/');
        const fileWithExt = parts[parts.length - 1];
        const folder = parts[parts.length - 2];
        const publicId = fileWithExt.split('.')[0];
        return `${folder}/${publicId}`;
    } catch {
        return null;
    }
};

export const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;
        let query = {};

        if (category) {
            query.category = validator.escape(String(category));
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                const min = Number(minPrice);
                if (!isNaN(min) && min >= 0) query.price.$gte = min;
            }
            if (maxPrice) {
                const max = Number(maxPrice);
                if (!isNaN(max) && max >= 0) query.price.$lte = max;
            }
        }
        if (search) {
            // Sanitize regex input to prevent ReDoS
            const sanitizedSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.title = { $regex: sanitizedSearch, $options: 'i' };
        }

        // Pagination
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('seller', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Product.countDocuments(query),
        ]);

        res.json({
            products,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock, image, images, contactPhone, socialMediaLink } = req.body;

        // ── Input Validation ──
        if (!title || !description || !price || !category || (!image && (!images || images.length === 0)) || !contactPhone) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({ message: 'Price must be a positive number' });
        }

        const numericStock = Number(stock);
        if (isNaN(numericStock) || numericStock < 0) {
            return res.status(400).json({ message: 'Stock must be a non-negative number' });
        }

        const productImages = images && images.length > 0 ? images : (image ? [image] : []);
        const mainImage = image || productImages[0];

        const product = new Product({
            seller: req.user._id,
            title: validator.escape(title.trim()),
            description: description.trim(),
            price: numericPrice,
            category: validator.escape(category.trim()),
            stock: Math.floor(numericStock), // Ensure integer
            image: mainImage,
            images: productImages,
            imagePublicId: getPublicIdFromUrl(mainImage),
            imagePublicIds: productImages.map(img => getPublicIdFromUrl(img)).filter(Boolean),
            contactPhone: contactPhone.trim(),
            socialMediaLink: socialMediaLink?.trim() || undefined,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this product' });
        }

        // Validate price if provided
        if (req.body.price !== undefined) {
            const numericPrice = Number(req.body.price);
            if (isNaN(numericPrice) || numericPrice <= 0) {
                return res.status(400).json({ message: 'Price must be a positive number' });
            }
            product.price = numericPrice;
        }

        // Validate stock if provided
        if (req.body.stock !== undefined) {
            const numericStock = Number(req.body.stock);
            if (isNaN(numericStock) || numericStock < 0) {
                return res.status(400).json({ message: 'Stock must be a non-negative number' });
            }
            product.stock = Math.floor(numericStock);
        }

        // If main image changed, clean up old Cloudinary image (if not in new images)
        if (req.body.image && req.body.image !== product.image) {
            if (product.imagePublicId && (!req.body.images || !req.body.images.includes(product.image))) {
                try {
                    await cloudinary.uploader.destroy(product.imagePublicId);
                } catch (cleanupErr) {
                    console.error('Cloudinary cleanup failed:', cleanupErr.message);
                }
            }
        }

        // If images array changed, clean up removed images
        if (req.body.images) {
            const oldImages = product.images || [];
            const removedImages = oldImages.filter(img => !req.body.images.includes(img) && img !== req.body.image);

            for (const imgUrl of removedImages) {
                const publicId = getPublicIdFromUrl(imgUrl);
                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                    } catch (cleanupErr) {
                        console.error('Cloudinary cleanup failed for removed image:', cleanupErr.message);
                    }
                }
            }
            product.images = req.body.images;
            product.imagePublicIds = req.body.images.map(img => getPublicIdFromUrl(img)).filter(Boolean);
            product.image = req.body.image || req.body.images[0] || product.image;
            product.imagePublicId = getPublicIdFromUrl(product.image) || product.imagePublicId;
        } else if (req.body.image && req.body.image !== product.image) {
            product.image = req.body.image;
            product.imagePublicId = getPublicIdFromUrl(req.body.image);
        }

        product.title = req.body.title ? validator.escape(req.body.title.trim()) : product.title;
        product.description = req.body.description || product.description;
        product.category = req.body.category ? validator.escape(req.body.category.trim()) : product.category;
        product.contactPhone = req.body.contactPhone || product.contactPhone;
        product.socialMediaLink = req.body.socialMediaLink !== undefined ? req.body.socialMediaLink : product.socialMediaLink;



        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Allow seller or admin to delete
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        // ── Clean up Cloudinary image(s) ──
        if (product.imagePublicId && (!product.imagePublicIds || !product.imagePublicIds.includes(product.imagePublicId))) {
            try {
                await cloudinary.uploader.destroy(product.imagePublicId);
            } catch (cleanupErr) {
                console.error('Cloudinary cleanup failed (main):', cleanupErr.message);
            }
        }

        if (product.imagePublicIds && product.imagePublicIds.length > 0) {
            for (const publicId of product.imagePublicIds) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (cleanupErr) {
                    console.error('Cloudinary cleanup failed (alt):', cleanupErr.message);
                }
            }
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
