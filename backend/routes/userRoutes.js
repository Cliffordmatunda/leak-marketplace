import express from 'express';
import { signup, login, logout, getMe, protect } from '../controllers/authController.js';


const router = express.Router();
console.log('✅ User Routes Loaded');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

export default router;