import mongoose from 'mongoose';

const productItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Item must belong to a product category (e.g., Business Fullz)']
    },
    // The actual secret data (NAME+SSN...)
    content: {
        type: String,
        required: [true, 'Product item must have content'],
        select: false // Never send this to frontend unless purchased
    },
    // The State (AL, TX, NY...) - Critical for your filter
    state: {
        type: String,
        required: true,
        uppercase: true,
        maxlength: 2
    },
    isSold: {
        type: Boolean,
        default: false
    },
    soldTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// INDEXING: Critical for speed when searching for "Unsold items in Texas"
productItemSchema.index({ product: 1, state: 1, isSold: 1 });

const ProductItem = mongoose.model('ProductItem', productItemSchema);

export default ProductItem;