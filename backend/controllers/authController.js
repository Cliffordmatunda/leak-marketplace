import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// ------------------------------------------------------------------
// SENIOR PATTERN: Centralized Cookie/Token Logic
// ------------------------------------------------------------------
const signToken = (id) => {
    console.log("🔍 DEBUG: Generating Token...");
    console.log("   -> JWT_SECRET Exists?", !!process.env.JWT_SECRET);
    console.log("   -> JWT_EXPIRES_IN Value:", process.env.JWT_EXPIRES_IN);
    console.log("   -> JWT_EXPIRES_IN Type:", typeof process.env.JWT_EXPIRES_IN);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Define cookie options
    const cookieOptions = {
        // ✅ FIX: Cookies use 'expires' (Date object), NOT 'expiresIn'
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // Browser JS cannot read this (prevents XSS)
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'strict' // CSRF protection
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

// ------------------------------------------------------------------
// 1. REGISTER (SIGNUP)
// ------------------------------------------------------------------
export const signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            // role: req.body.role -- Admin must be set manually in DB
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ status: 'fail', message: 'Email already exists' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 2. LOGIN
// ------------------------------------------------------------------
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
        }

        // 2. Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        // 3. Send token
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 3. LOGOUT
// ------------------------------------------------------------------
export const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

// ------------------------------------------------------------------
// 4. PROTECT MIDDLEWARE
// ------------------------------------------------------------------
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in! Please log in to get access.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer does exist.' });
        }

        req.user = currentUser;
        next();

    } catch (err) {
        return res.status(401).json({ status: 'fail', message: 'Invalid Token' });
    }
};

// ------------------------------------------------------------------
// 5. RESTRICT TO (Roles)
// ------------------------------------------------------------------
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

// ------------------------------------------------------------------
// 6. GET ME
// ------------------------------------------------------------------
export const getMe = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
};