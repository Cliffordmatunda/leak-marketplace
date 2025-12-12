import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// ------------------------------------------------------------------
// 1. CREATE MANUAL ORDER (User Action)
// ------------------------------------------------------------------
export const createManualOrder = async (req, res) => {
    try {
        const { productId, paymentMethod, transactionHash } = req.body;

        // 1. Get the Product
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // 2. Determine which of YOUR addresses to show
        // Ideally, store these in .env
        let myWalletAddress = '';
        if (paymentMethod === 'BTC') myWalletAddress = process.env.WALLET_BTC;
        if (paymentMethod === 'USDT') myWalletAddress = process.env.WALLET_USDT;

        // 3. Create the Order (Status: Pending)
        const newOrder = await Order.create({
            user: req.user.id,
            product: product.id,
            priceUSD: product.price,
            paymentMethod,
            paymentAddressUsed: myWalletAddress,
            transactionHash: transactionHash || 'Not Provided Yet'
        });

        res.status(201).json({
            status: 'success',
            message: 'Order placed! Waiting for manual admin approval.',
            data: { order: newOrder }
        });

    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 2. APPROVE ORDER (Admin Action)
// ------------------------------------------------------------------
export const approveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // 1. Find Order
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // 2. Update Status
        order.status = 'completed';
        await order.save();

        // 3. Unlock Product for User
        // We add the product ID to the user's "purchasedProducts" array
        await User.findByIdAndUpdate(order.user, {
            $addToSet: { purchasedProducts: order.product }
        });

        // 4. (Optional) Trigger Email Notification here
        // sendEmail(order.user.email, "Your download is ready!");

        res.status(200).json({
            status: 'success',
            message: `Order ${orderId} approved. User can now download.`
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
        // Find bookings where user matches the logged-in ID
        // .populate('product') fills in the Title, Price, etc. from the Product ID
        const orders = await Order.find({ user: req.user.id })
            .populate('product')
            .sort('-createdAt'); // Newest first

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
        // Fetch ALL orders, newest first
        // Populate user (name, email) and product (title, price)
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