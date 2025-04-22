const User = require('../models/user.model');
const passport = require('passport');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, enrollmentId, phoneNumber, techStack } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { enrollmentId }] });
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email or enrollment ID already exists'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            enrollmentId,
            phoneNumber,
            techStack: techStack ? techStack.split(',').map(tech => tech.trim()) : []
        });

        await user.save();

        // Log in the user
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging in after signup' });
            }
            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    enrollmentId: user.enrollmentId
                }
            });
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ 
                message: info.message || 'Invalid credentials',
                error: process.env.NODE_ENV === 'development' ? info : undefined
            });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    enrollmentId: user.enrollmentId,
                    phoneNumber: user.phoneNumber,
                    techStack: user.techStack
                }
            });
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ 
                message: 'Error logging out',
                error: process.env.NODE_ENV === 'development' ? err : undefined
            });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ 
                    message: 'Error destroying session',
                    error: process.env.NODE_ENV === 'development' ? err : undefined
                });
            }
            res.clearCookie('connect.sid');
            res.json({ message: 'Logged out successfully' });
        });
    });
};

exports.getCurrentUser = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            enrollmentId: req.user.enrollmentId,
            phoneNumber: req.user.phoneNumber,
            techStack: req.user.techStack
        }
    });
};

exports.getStatus = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                enrollmentId: req.user.enrollmentId,
                phoneNumber: req.user.phoneNumber,
                techStack: req.user.techStack
            }
        });
    } else {
        res.json({ 
            isAuthenticated: false,
            message: 'Not authenticated'
        });
    }
}; 