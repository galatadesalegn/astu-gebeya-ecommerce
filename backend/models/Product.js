import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        required: [true, 'Please provide a product image'],
    },
    images: {
        type: [{ type: String }],
        validate: [v => v.length <= 4, 'Maximum of 4 alternative images allowed'],
    },
    imagePublicId: {
        type: String, // Cloudinary public_id for cleanup on delete
    },
    imagePublicIds: {
        type: [{ type: String }], // Cloudinary public_ids for alternatives
    },
    title: {
        type: String,
        required: [true, 'Please provide a product title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: [0.01, 'Price must be greater than 0'],
    },
    currency: { type: String, default: 'ETB' },
    category: {
        type: String,
        required: [true, 'Please provide a product category'],
        trim: true,
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        default: 0,
        min: [0, 'Stock cannot be negative'],
    },
    contactPhone: {
        type: String,
        required: [true, 'Please provide a contact phone number'],
    },
    socialMediaLink: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved',
    },
    isFlagged: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Indexes for performance
productSchema.index({ seller: 1 });
productSchema.index({ status: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ title: 'text' }); // Text index for search
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
