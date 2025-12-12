import express from 'express';
import {
    getAllProducts,
    createProduct,
    getUploadUrl,
    updateProduct, // <--- Import this
    deleteProduct  // <--- Import this
} from '../controllers/productController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// Public: Get List
router.get('/', getAllProducts);

// Protected: Admin Actions
router.use(protect);
router.use(restrictTo('admin'));

router.get('/upload-url', getUploadUrl);
router.post('/', createProduct);

// CRUD ROUTES
router.route('/:id')
    .patch(updateProduct) // Edit
    .delete(deleteProduct); // Delete

export default router;