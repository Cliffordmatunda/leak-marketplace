import express from 'express';
import {
    createOrder,
    approveOrder,
    getMyOrders,
    getAllOrders
} from '../controllers/bookingController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);

// ✅ MATCHES: /api/v1/orders
router.route('/')
    .get(getMyOrders)       // <--- Frontend calls this
    .post(createOrder);     // <--- Frontend PurchaseModal calls this

router.route('/all')
    .get(restrictTo('admin'), getAllOrders);

router.route('/:orderId/approve')
    .patch(restrictTo('admin'), approveOrder);

export default router;