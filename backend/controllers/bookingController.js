import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const createOrder = async (req, res) => {
    try {
        const { productId, paymentMethod, transactionHash, paymentAddressUsed } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let finalAddress = paymentAddressUsed;
        if (!finalAddress) {
            if (paymentMethod === 'BTC') finalAddress = process.env.WALLET_BTC;
            else if (paymentMethod === 'USDT') finalAddress = process.env.WALLET_USDT;
            else finalAddress = 'Manual/Unknown';
        }

        const newOrder = await Order.create({
            user: req.user._id,
            product: product._id,
            priceUSD: product.price,
            paymentMethod,
            paymentAddressUsed: finalAddress,
            transactionHash: transactionHash || 'Pending'
        });

        res.status(201).json({ status: 'success', data: { order: newOrder } });
    } catch (err) {
        console.error("Create Order Error:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const approveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = 'completed';
        await order.save();

        await User.findByIdAndUpdate(order.user, {
            $addToSet: { purchasedProducts: order.product }
        });

        res.status(200).json({ status: 'success', message: 'Order approved' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        // ✅ Ensure req.user._id is used
        const orders = await Order.find({ user: req.user._id })
            .populate('product')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });
    } catch (err) {
        console.error("Get Orders Error:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

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