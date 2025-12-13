import Product from '../models/productModel.js';
import ProductItem from '../models/productItemModel.js';
import APIFeatures from '../utils/apiFeatures.js';

// ------------------------------------------------------------------
// 1. GET ALL PRODUCTS
// ------------------------------------------------------------------
export const getAllProducts = async (req, res) => {
    try {
        const features = new APIFeatures(Product.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const products = await features.query;

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 2. GET SINGLE PRODUCT
// ------------------------------------------------------------------
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 3. CREATE PRODUCT (Admin)
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// 3. CREATE PRODUCT (Admin)
// ------------------------------------------------------------------
export const createProduct = async (req, res) => {
    try {
        // 1. AUTO-ASSIGN OWNER (The Admin who is logged in)
        // The 'protect' middleware adds 'req.user', so we use that ID.
        if (!req.body.owner) {
            req.body.owner = req.user._id;
        }

        // 2. HANDLE S3 KEY (File Source)
        // If it's "Fullz" (Text Data), we don't have a file.
        // We set it to 'DB_TEXT' so the validator doesn't crash.
        if (!req.body.s3Key) {
            req.body.s3Key = 'DB_TEXT';
        }

        // 3. Create
        const newProduct = await Product.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { product: newProduct }
        });
    } catch (err) {
        console.error("Create Product Error:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
// ------------------------------------------------------------------
// 4. UPDATE PRODUCT (Admin) - RESTORED ✅
// ------------------------------------------------------------------
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'No product found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 5. DELETE PRODUCT (Admin) - RESTORED ✅
// ------------------------------------------------------------------
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'No product found with that ID' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 6. ADD FULLZ DATA (Inventory Logic)
// ------------------------------------------------------------------
export const addFullz = async (req, res) => {
    try {
        const { productId, state, dataLines } = req.body;

        if (!productId || !state || !dataLines) {
            return res.status(400).json({ message: 'Missing required fields: productId, state, dataLines' });
        }

        // 1. Prepare items
        const itemsToInsert = dataLines.map(line => ({
            product: productId,
            state: state.toUpperCase(),
            content: line,
            isSold: false
        }));

        // 2. Bulk Insert
        await ProductItem.insertMany(itemsToInsert);

        // 3. Recalculate Total Stock
        const newTotalStock = await ProductItem.countDocuments({
            product: productId,
            isSold: false
        });

        await Product.findByIdAndUpdate(productId, {
            stockCount: newTotalStock
        });

        res.status(201).json({
            status: 'success',
            message: `Successfully added ${dataLines.length} items to ${state}`,
            data: { currentStock: newTotalStock }
        });

    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 7. GET FULLZ STATS (For State Grid)
// ------------------------------------------------------------------
export const getFullzStats = async (req, res) => {
    try {
        const { productId } = req.params;

        const stats = await ProductItem.aggregate([
            {
                // Match this product ID (converted to ObjectId) & Unsold items
                $match: {
                    $expr: { $eq: ['$product', { $toObjectId: productId }] },
                    isSold: false
                }
            },
            {
                $group: {
                    _id: "$state",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const stateMap = {};
        stats.forEach(item => {
            stateMap[item._id] = item.count;
        });

        res.status(200).json({
            status: 'success',
            data: { stats: stateMap }
        });

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};