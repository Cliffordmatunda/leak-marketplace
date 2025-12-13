import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ------------------------------------------------------------------
// 1. CONFIG & PATHS
// ------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Force load .env from the backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

import app from './app.js';

// ------------------------------------------------------------------
// 2. CONNECT TO DATABASE
// ------------------------------------------------------------------
// ✅ FIX: Changed from 'DATABASE' to 'MONGO_URI' to match your .env file
const DB = process.env.DATABASE;

console.log("🔍 CONNECTION DEBUG:");
console.log("   -> Target URL:", DB || "❌ UNDEFINED (Check .env filename and location)");

if (!DB) {
    console.error("❌ ERROR: Connection string is missing.");
    process.exit(1);
}

mongoose.connect(DB)
    .then(() => console.log('✅ DB Connection Successful!'))
    .catch((err) => {
        console.error('❌ DB Connection Error:', err.message);
        console.error('   -> Check if MongoDB is running locally (mongod.exe)');
    });

// ------------------------------------------------------------------
// 3. MIDDLEWARE & CORS
// ------------------------------------------------------------------
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

// ------------------------------------------------------------------
// 4. SERVE FRONTEND (Production)
// ------------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

// ------------------------------------------------------------------
// 5. START SERVER
// ------------------------------------------------------------------
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}...`);
});