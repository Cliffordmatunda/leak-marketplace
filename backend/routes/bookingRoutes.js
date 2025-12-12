import express from 'express';
import {
    createManualOrder,
    approveOrder,
    getMyOrders,
    getAllOrders // <--- 1. Make sure this is imported!
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// Protect all routes (User must be logged in)
router.use(protect);

// === USER ROUTES ===
router.get('/my-orders', getMyOrders);     // Users see their own orders
router.post('/', createManualOrder);       // Users create new orders

// === ADMIN ROUTES ===
// This is the route that was giving you the 404 error
// It listens for GET /api/v1/bookings
router.get('/', restrictTo('admin'), getAllOrders);

router.patch('/:orderId/approve', restrictTo('admin'), approveOrder);

export default router;