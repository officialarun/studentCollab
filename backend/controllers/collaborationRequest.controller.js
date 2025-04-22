const CollaborationRequest = require('../models/collaborationRequest.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

// Create a new collaboration request
exports.createRequest = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is already a collaborator
        if (project.collaborators.includes(userId)) {
            return res.status(400).json({ message: 'You are already a collaborator on this project' });
        }

        // Check if user has already sent a request
        const existingRequest = await CollaborationRequest.findOne({
            project: projectId,
            user: userId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You have already sent a collaboration request' });
        }

        // Create new request
        const request = new CollaborationRequest({
            project: projectId,
            user: userId,
            message: req.body.message
        });

        await request.save();

        // Create notification for project owner
        const notification = new Notification({
            user: project.owner,
            type: 'collaboration_request',
            message: `${req.user.name} has requested to collaborate on your project "${project.title}"`,
            data: {
                projectId,
                requestId: request._id
            }
        });

        await notification.save();

        res.status(201).json({
            message: 'Collaboration request sent successfully',
            request
        });
    } catch (error) {
        console.error('Error creating collaboration request:', error);
        res.status(500).json({ message: 'Error creating collaboration request' });
    }
};

// Get all collaboration requests for a project
exports.getProjectRequests = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        // Check if project exists and user is the owner
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to view these requests' });
        }

        const requests = await CollaborationRequest.find({ project: projectId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching collaboration requests:', error);
        res.status(500).json({ message: 'Error fetching collaboration requests' });
    }
};

// Get all collaboration requests for the current user
exports.getUserRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const requests = await CollaborationRequest.find({ user: userId })
            .populate('project', 'title owner')
            .populate('project.owner', 'name')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({ message: 'Error fetching user requests' });
    }
};

// Accept a collaboration request
exports.acceptRequest = async (req, res) => {
    try {
        const request = await CollaborationRequest.findById(req.params.requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const project = await Project.findById(request.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user is the project owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only project owner can accept requests' });
        }

        // Add collaborator to project
        if (!project.collaborators.includes(request.fromUser)) {
            project.collaborators.push(request.fromUser);
            await project.save();
        }

        // Get both users
        const collaborator = await User.findById(request.fromUser);
        const projectOwner = await User.findById(project.owner);

        if (collaborator && projectOwner) {
            // Add project to collaborator's collaborations
            if (!collaborator.collaborations.includes(project._id)) {
                collaborator.collaborations.push(project._id);
            }

            // Add project owner to collaborator's authenticatedUsers list
            if (!collaborator.authenticatedUsers.includes(project.owner)) {
                collaborator.authenticatedUsers.push(project.owner);
            }

            // Add collaborator to project owner's authenticatedUsers list
            if (!projectOwner.authenticatedUsers.includes(request.fromUser)) {
                projectOwner.authenticatedUsers.push(request.fromUser);
            }

            // Save both users
            await collaborator.save();
            await projectOwner.save();
        }

        // Create notification for the requester
        const notification = new Notification({
            type: 'request_accepted',
            projectId: project._id,
            fromUser: req.user.id,
            toUser: request.fromUser,
            message: `Your collaboration request for project "${project.title}" has been accepted`
        });
        await notification.save();

        // Delete the request
        await CollaborationRequest.findByIdAndDelete(request._id);

        res.json({ 
            message: 'Collaboration request accepted successfully',
            data: {
                projectId: project._id,
                collaboratorId: request.fromUser,
                projectOwnerId: project.owner
            }
        });
    } catch (error) {
        console.error('Error accepting collaboration request:', error);
        res.status(500).json({ message: 'Error accepting collaboration request' });
    }
};

// Reject a collaboration request
exports.rejectRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await CollaborationRequest.findById(requestId)
            .populate('project');

        if (!request) {
            return res.status(404).json({ message: 'Collaboration request not found' });
        }

        // Check if user is the project owner
        if (request.project.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to reject this request' });
        }

        // Update request status
        request.status = 'rejected';
        await request.save();

        // Create notification for the requester
        const notification = new Notification({
            user: request.user,
            type: 'collaboration_rejected',
            message: `Your collaboration request for "${request.project.title}" has been rejected`,
            data: {
                projectId: request.project._id
            }
        });

        await notification.save();

        res.json({
            message: 'Collaboration request rejected successfully',
            request
        });
    } catch (error) {
        console.error('Error rejecting collaboration request:', error);
        res.status(500).json({ message: 'Error rejecting collaboration request' });
    }
}; 