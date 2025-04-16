const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
};

// User routes (all protected)
router.get('/profile', isAuthenticated, userController.getProfile);
router.put('/profile', isAuthenticated, userController.updateProfile);
router.get('/projects', isAuthenticated, userController.getUserProjects);
router.get('/collaborations', isAuthenticated, userController.getUserCollaborations);

module.exports = router; 