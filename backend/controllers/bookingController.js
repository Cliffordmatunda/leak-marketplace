import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// ------------------------------------------------------------------
// 1. CREATE ORDER (Unified Function)
// ------------------------------------------------------------------
export const createOrder = async (req, res) => {
    try {
        const { productId, paymentMethod, transactionHash, paymentAddressUsed } = req.body;

        // 1. Get the Product
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // 2. Determine Address (Prefer what frontend sent, fallback to env, fallback to 'Unknown')
        // This PREVENTS the "Path required" error if frontend fails.
        let finalAddress = paymentAddressUsed;

        if (!finalAddress) {
            if (paymentMethod === 'BTC') finalAddress = process.env.WALLET_BTC;
            else if (paymentMethod === 'USDT') finalAddress = process.env.WALLET_USDT;
            else finalAddress = 'Manual/Unknown';
        }

        // 3. Create the Order
        const newOrder = await Order.create({
            user: req.user._id, // Ensure your auth middleware sets req.user
            product: product._id,
            priceUSD: product.price,
            paymentMethod,
            paymentAddressUsed: finalAddress, // ✅ This will now always have a value
            transactionHash: transactionHash || 'Pending'
        });

        res.status(201).json({
            status: 'success',
            message: 'Order placed! Waiting for manual approval.',
            data: { order: newOrder }
        });

    } catch (err) {
        console.error("Create Order Error:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 2. APPROVE ORDER (Admin Action)
// ------------------------------------------------------------------
export const approveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = 'completed';
        await order.save();

        // Unlock Product for User
        await User.findByIdAndUpdate(order.user, {
            $addToSet: { purchasedProducts: order.product }
        });

        res.status(200).json({
            status: 'success',
            message: `Order ${orderId} approved.`
        });

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// ------------------------------------------------------------------
// 3. GET MY ORDERS (User History)
// ------------------------------------------------------------------
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('product')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// ------------------------------------------------------------------
// 4. GET ALL ORDERS (Admin Only)
// ------------------------------------------------------------------
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('product', 'title price')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};