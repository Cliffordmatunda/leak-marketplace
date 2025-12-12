import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import app from './app.js'; // Imports your Express app setup (middleware, routes)

dotenv.config({ path: './.env' });

// 1. Database Connection
mongoose.connect(process.env.DATABASE)
    .then(() => console.log('✅ DB Connection Successful!'))
    .catch((err) => console.error('❌ DB Connection Error:', err));

// 2. Handle CORS (Allow Frontend to talk to Backend)
// In production, they are same domain, but good safety for local dev
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    credentials: true
}));

// ------------------------------------------------------------------
// SERVE FRONTEND (Production Only)
// ------------------------------------------------------------------
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    // A. Serve static files from the React build folder
    // We go up one level (..) because 'backend' and 'frontend' are siblings
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // B. The "Catch-All" Route
    // Any request that isn't an API call gets sent to index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

// 3. Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}...`);
});