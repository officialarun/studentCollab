const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
};

// Get all notifications for the current user
router.get('/', isAuthenticated, notificationController.getUserNotifications);

// Get unread notifications count
router.get('/unread-count', isAuthenticated, notificationController.getUnreadCount);

// Mark a notification as read
router.put('/:notificationId/read', isAuthenticated, notificationController.markNotificationRead);

// Mark all notifications as read
router.put('/read-all', isAuthenticated, notificationController.markAllNotificationsRead);

// Delete a notification
router.delete('/:notificationId', isAuthenticated, notificationController.deleteNotification);

module.exports = router; 