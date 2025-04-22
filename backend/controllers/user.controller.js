const User = require('../models/user.model');
const Project = require('../models/project.model');
const Notification = require('../models/notification.model');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('projects')
            .populate('collaborations');

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phoneNumber, techStack } = req.body;

        // Check if email is being changed
        if (req.body.email && req.body.email !== req.user.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // Check if enrollment ID is being changed
        if (req.body.enrollmentId && req.body.enrollmentId !== req.user.enrollmentId) {
            const existingUser = await User.findOne({ enrollmentId: req.body.enrollmentId });
            if (existingUser) {
                return res.status(400).json({ message: 'Enrollment ID already in use' });
            }
        }

        // Update user fields
        Object.assign(req.user, {
            name: name || req.user.name,
            email: req.body.email || req.user.email,
            enrollmentId: req.body.enrollmentId || req.user.enrollmentId,
            phoneNumber: phoneNumber || req.user.phoneNumber,
            techStack: techStack ? techStack.split(',').map(tech => tech.trim()) : req.user.techStack
        });

        await req.user.save();

        res.json({
            message: 'Profile updated successfully',
            user: req.user
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
};

// Get user's projects
exports.getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id })
            .populate('owner', 'name email')
            .populate('collaborators', 'name email')
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ message: 'Error fetching user projects' });
    }
};

// Get user's collaborations
exports.getUserCollaborations = async (req, res) => {
    try {
        const collaborations = await Project.find({ collaborators: req.user._id })
            .populate('owner', 'name email')
            .populate('collaborators', 'name email')
            .sort({ createdAt: -1 });

        res.json(collaborations);
    } catch (error) {
        console.error('Error fetching user collaborations:', error);
        res.status(500).json({ message: 'Error fetching user collaborations' });
    }
};

// Get user's notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

// Mark notification as read
exports.markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.notificationId,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.json({
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error marking notification as read' });
    }
};

// Mark all notifications as read
exports.markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Error marking all notifications as read' });
    }
};

// Get other user's profile
exports.getOtherUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password')
            .populate('projects')
            .populate('collaborations');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the requesting user is in the target user's authenticatedUsers list
        if (!user.authenticatedUsers.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to view this profile' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
}; 