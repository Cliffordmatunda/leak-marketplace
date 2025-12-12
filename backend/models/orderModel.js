import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Order must contain a product']
  },
  priceUSD: {
    type: Number,
    required: [true, 'Order must have a USD price']
  },
  
  // Manual Payment Details
  paymentMethod: {
    type: String,
    enum: ['BTC', 'USDT', 'ETH'],
    required: true
  },
  paymentAddressUsed: { 
    type: String, // The address you asked them to send money to
    required: true 
  },
  transactionHash: {
    type: String, // The user provides this as proof
    trim: true
  },
  
  status: {
    type: String,
    enum: ['pending_verification', 'completed', 'cancelled'],
    default: 'pending_verification'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
