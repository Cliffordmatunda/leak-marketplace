import express from 'express';
import {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    addFullz,       // ✅ New Inventory Logic
    getFullzStats   // ✅ New Stats Logic
} from '../controllers/productController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// 1. General Product Routes (Marketplace)
router.route('/')
    .get(getAllProducts)
    .post(protect, restrictTo('admin'), createProduct);

// 2. Fullz Inventory Routes (The new logic we added)
router.post('/add-fullz', protect, restrictTo('admin'), addFullz);
router.get('/:productId/stats', protect, getFullzStats);

// 3. Specific Product Routes (Detail, Edit, Delete)
router.route('/:id')
    .get(getProduct)
    .patch(protect, restrictTo('admin'), updateProduct)
    .delete(protect, restrictTo('admin'), deleteProduct);

export default router;