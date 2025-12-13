import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const app = express();

// 1. GLOBAL LOGGER
app.use((req, res, next) => {
    console.log(`📢 REQUEST: ${req.method} ${req.url}`);
    next();
});

// 2. SECURITY HEADERS
app.use(helmet());

// 3. CORS (FIXED: Allow both React & Vite ports)
// We define this BEFORE routes so headers are applied correctly
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

// 4. BODY PARSERS
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 5. SANITIZATION
app.use(mongoSanitize());
app.use(xss());

// 6. ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', bookingRouter);

// 7. ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('🔥 ERROR:', err.stack);
    res.status(500).json({ status: 'error', message: err.message });
});

export default app;