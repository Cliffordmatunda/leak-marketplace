import express from 'express';
import {
    createOrder,      // <--- CHANGED THIS (was createManualOrder)
    approveOrder,
    getMyOrders,
    getAllOrders
} from '../controllers/bookingController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// 1. Protect all routes (User must be logged in)
router.use(protect);

// 2. Routes for Users
router.route('/')
    .get(getMyOrders)          // User sees their own history
    .post(createOrder);        // <--- User creates a new order (Buying)

// 3. Routes for Admins Only
router.route('/all')
    .get(restrictTo('admin'), getAllOrders); // Admin sees everyone's orders

router.route('/:orderId/approve')
    .patch(restrictTo('admin'), approveOrder); // Admin approves payment

export default router;