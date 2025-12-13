import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// --- Token Helpers ---
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    });
};

// 1. SIGNUP (Username based)
export const signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            username: req.body.username, // ✅ Changed
            password: req.body.password
        });
        createSendToken(newUser, 201, res);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ status: 'fail', message: 'Username already taken!' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 2. LOGIN (Username based)
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body; // ✅ Changed

        // 1. Check if username and password exist
        if (!username || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide username and password' });
        }

        // 2. Check if user exists && password is correct
        const user = await User.findOne({ username }).select('+password'); // ✅ Changed

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect username or password' });
        }

        // 3. Send token
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 3. LOGOUT
export const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

// 4. PROTECT
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.cookies.jwt) token = req.cookies.jwt;
        if (!token) return res.status(401).json({ status: 'fail', message: 'Not logged in' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) return res.status(401).json({ status: 'fail', message: 'User no longer exists' });

        req.user = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({ status: 'fail', message: 'Invalid Token' });
    }
};

// 5. RESTRICT
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: 'fail', message: 'Permission denied' });
        }
        next();
    };
};

// 6. GET ME
export const getMe = (req, res, next) => {
    res.status(200).json({ status: 'success', data: { user: req.user } });
};