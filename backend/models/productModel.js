import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        required: [true, 'A product must have a title'],
        trim: true,
        maxlength: [100, 'Title must be under 100 chars']
    },
    slug: String,
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

    // Inventory System
    stock: {
        type: Number,
        default: 1, // Default to 1, but Fullz logic will update this
        min: [0, 'Stock cannot be negative']
    },

    // The Asset (Hidden security field)
    // We make this optional in Schema because Fullz uses text lines, not always files.
    // However, the Controller validates logic based on type.
    s3Key: {
        type: String,
        select: false
    },
    fileSize: Number,
    fileType: String,

    // Filtering & Categories
    category: {
        type: String,
        required: [true, 'Category is required'],
        // Matches your Frontend NavData
        enum: ['Bank', 'Bank accounts', 'Accounts', 'cc', 'fullz', 'cards', 'bins', 'Full Info', 'Enroll', 'Lookup Services']
    },

    // ✅ FEATURE FLAGS: This stores ["LOGIN+PASS", "BALANCE", "USA"] etc.
    tags: [String],

    // Author
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Product must belong to a user']
    },

    // Stats
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware: Auto-slug
productSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

// Indexing for Search Speed
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 }); // Important for Badge filtering

const Product = mongoose.model('Product', productSchema);

export default Product;