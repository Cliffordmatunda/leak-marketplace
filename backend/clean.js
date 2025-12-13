import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 1. Setup Path to .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. Connect
const DB = process.env.MONGO_URI;
mongoose.connect(DB).then(() => console.log('✅ Connected to DB'));

const cleanDB = async () => {
    try {
        console.log('⚠️  Dropping Users Collection...');

        // This command deletes the DATA and the INDEXES (Fixing the ghost email issue)
        await mongoose.connection.collection('users').drop();

        console.log('✅ Users Collection Dropped! Old indexes are gone.');
    } catch (err) {
        if (err.code === 26) {
            console.log('👍 Collection was already empty.');
        } else {
            console.error('❌ Error:', err.message);
        }
    } finally {
        process.exit();
    }
};

cleanDB();