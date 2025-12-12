import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// ------------------------------------------------------------------
// SENIOR PATTERN: Centralized Cookie/Token Logic
// ------------------------------------------------------------------
const signToken = (id) => {
    console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET);
    console.log("🔍 JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Define cookie options
    const cookieOptions = {
        expiresIn: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // IMPORTANT: Browser JS cannot read this cookie (prevents XSS)
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in prod
        sameSite: 'strict' // CSRF protection
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output (even though we selected false in model, better safe than sorry)
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token, // Optional: send token in JSON too if you want to use it for non-browser clients
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
        // Whitelist the fields we accept. Do NOT use req.body directly to create a user.
        // This prevents malicious users from manually setting their role to "admin".
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            // role: req.body.role -- NEVER allow this. Admins are made manually in DB.
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        // Handle duplicate email error
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
        // We explicitly select('+password') because we set select:false in the model
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        // 3. If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ------------------------------------------------------------------
// 3. LOGOUT
// ------------------------------------------------------------------
export const logout = (req, res) => {
    // You can't "delete" a cookie from the server, you replace it with bad data
    // and a very short expiration time (10 seconds).
    res.cookie('jwt', 'loggedout', {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

// ------------------------------------------------------------------
// 4. PROTECT MIDDLEWARE (The Gatekeeper)
// ------------------------------------------------------------------
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in cookies
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in! Please log in to get access.' });
        }

        // Verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists (in case they were deleted after token issue)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer does exist.' });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();

    } catch (err) {
        return res.status(401).json({ status: 'fail', message: 'Invalid Token' });
    }
};

// ------------------------------------------------------------------
// 5. RESTRICT TO (Role Based Access Control)
// ------------------------------------------------------------------
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
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
// 5. GET ME (Persistence)
// ------------------------------------------------------------------
// This allows the user to stay logged in when refreshing the page
export const getMe = (req, res, next) => {
    // We just send back the user that the 'protect' middleware found
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
};