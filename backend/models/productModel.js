import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        required: [true, 'A product must have a title'],
        trim: true,
        maxlength: [100, 'A product title must have less than or equal to 100 characters']
    },
    slug: String, // URL-friendly version of title
    description: {
        type: String,
        required: [true, 'A product must have a description']
    },

    // The Money
    price: {
        type: Number,
        required: [true, 'A product must have a price'],
        min: [0, 'Price must be above 0']
    },

    // Inventory (Added this missing field)
    stock: {
        type: Number,
        default: 1,
        min: [0, 'Stock cannot be negative']
    },

    // The Asset (Security Critical)
    s3Key: {
        type: String,
        required: [true, 'A product must have a file source'],
        select: false // HIDDEN. Never send this to the frontend publicly.
    },
    fileSize: Number, // Useful to show "2.5 GB" on the UI
    fileType: String, // "csv", "json", "pdf"

    // Filtering & Discovery
    category: {
        type: String,
        required: [true, 'A product must have a category'],
        enum: {
            // ⚠️ FIXED: Changed 'accounts' to 'Accounts' to match Frontend
            values: ['Bank', 'Accounts', 'cc', 'fullz', 'cards', 'bins', 'Full Info'],
            message: 'Category is either: Bank, Accounts, cc, fullz, cards, bins, Full Info'
        }
    },
    tags: [String], // Array of strings for search keywords

    // Author
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A product must belong to a user']
    },

    // Stats
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// MIDDLEWARE: Auto-create slug from title before saving
// Example: "Chase Bank Log" -> "chase-bank-log"
productSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

// INDEXING: Critical for "Filter Features" performance
// This makes searching by price and category instant, even with 1M products.
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;