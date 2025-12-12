import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid'; // Make sure you ran: npm install uuid
import Product from '../models/productModel.js';
import s3 from '../utils/s3.js';

// ------------------------------------------------------------------
// 1. GENERATE UPLOAD URL (Presigned URL)
// ------------------------------------------------------------------
export const getUploadUrl = async (req, res) => {
    try {
        if (!req.query.fileType) {
            return res.status(400).json({ status: 'fail', message: 'Missing fileType query parameter' });
        }

        // Generate a random filename to prevent overwrites
        const fileExtension = req.query.fileType.split('/')[1];
        const key = `uploads/${req.user.id}/${uuidv4()}.${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: req.query.fileType
        });

        // Generate the URL. Client has 60 seconds to start the upload.
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

        res.status(200).json({
            status: 'success',
            uploadUrl, // Frontend uses this to PUT the file
            key        // Frontend saves this to send to createProduct
        });
    } catch (err) {
        console.error('S3 Presign Error:', err);
        res.status(500).json({ status: 'error', message: 'Could not generate upload link' });
    }
};

// ------------------------------------------------------------------
// 2. CREATE PRODUCT (Metadata)
// ------------------------------------------------------------------
export const createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create({
            ...req.body, // Spreads title, price, description, category, stock, etc.
            owner: req.user.id, // Securely assign the logged-in user
            s3Key: req.body.s3Key // Link the file we just uploaded
        });

        res.status(201).json({
            status: 'success',
            data: {
                product: newProduct
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 3. GET ALL PRODUCTS (With Search, Filter & Sort)
// ------------------------------------------------------------------
export const getAllProducts = async (req, res) => {
    try {
        // 1. EXTRACT SPECIAL PARAMS
        const { search, minPrice, maxPrice, category, type, sort } = req.query;

        // 2. BUILD THE SEARCH FILTER
        let queryObj = {};

        // A. "Smart Search" (Checks Title AND Tags)
        if (search) {
            queryObj.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // B. Category (Case Insensitive Matching)
        if (category) {
            queryObj.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        // C. Sub-Category (Matches tags)
        if (type) {
            queryObj.tags = { $in: [type] };
        }

        // D. Price Logic
        if (minPrice || maxPrice) {
            queryObj.price = {};
            if (minPrice) queryObj.price.$gte = Number(minPrice);
            if (maxPrice) queryObj.price.$lte = Number(maxPrice);
        }

        // 3. EXECUTE QUERY
        let query = Product.find(queryObj);

        // Sorting
        if (sort) {
            const sortBy = sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // Default: Newest first
        }

        const products = await query;

        // 4. SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// ------------------------------------------------------------------
// 4. GET SINGLE PRODUCT
// ------------------------------------------------------------------
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'No product found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: 'Invalid ID' });
    }
};

// ------------------------------------------------------------------
// 5. UPDATE PRODUCT (Admin/Owner)
// ------------------------------------------------------------------
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the new updated document
            runValidators: true // Ensure price is number, etc.
        });

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'No product found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 6. DELETE PRODUCT (Admin/Owner)
// ------------------------------------------------------------------
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'No product found with that ID' });
        }

        // NOTE: In a real production app, we would also delete the file from S3 here.
        // For now, removing it from the DB is sufficient.

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};