const Project = require('../models/project.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const { search, techStack } = req.query;
        let query = {};

        // Add search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Add tech stack filter
        if (techStack) {
            const techStackArray = techStack.split(',').map(tech => tech.trim());
            query.techStack = { $in: techStackArray };
        }

        const projects = await Project.find(query)
            .populate('owner', 'name email')
            .populate('collaborators', 'name email')
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

// Get single project
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('collaborators', 'name email');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project' });
    }
};

// Create project
exports.createProject = async (req, res) => {
    try {
        const { title, description, techStack, lookingFor, githubLink } = req.body;

        // Validate required fields
        if (!title || !description || !techStack || !lookingFor) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const project = new Project({
            title,
            description,
            owner: req.user._id,
            techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map(tech => tech.trim()),
            lookingFor: Array.isArray(lookingFor) ? lookingFor : lookingFor.split(',').map(role => role.trim()),
            githubLink
        });

        await project.save();

        // Add project to user's projects
        req.user.projects.push(project._id);
        await req.user.save();

        res.status(201).json({
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: error.message || 'Error creating project' });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        const { title, description, techStack, lookingFor, githubLink, status } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the owner
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        project.title = title;
        project.description = description;
        project.techStack = techStack.split(',').map(tech => tech.trim());
        project.lookingFor = lookingFor.split(',').map(role => role.trim());
        project.githubLink = githubLink;
        if (status) project.status = status;

        await project.save();

        res.json({
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project' });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the owner
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        // Remove project from user's projects
        req.user.projects = req.user.projects.filter(p => p.toString() !== project._id.toString());
        await req.user.save();

        // Remove project from collaborators' collaborations
        await User.updateMany(
            { collaborations: project._id },
            { $pull: { collaborations: project._id } }
        );

        await project.deleteOne();

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
};

// Add collaborator
exports.addCollaborator = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the owner
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add collaborators' });
        }

        const { userId } = req.body;

        // Check if user is already a collaborator
        if (project.collaborators.includes(userId)) {
            return res.status(400).json({ message: 'User is already a collaborator' });
        }

        project.collaborators.push(userId);
        await project.save();

        // Add project to user's collaborations
        const user = await User.findById(userId);
        user.collaborations.push(project._id);
        await user.save();

        res.json({
            message: 'Collaborator added successfully',
            project
        });
    } catch (error) {
        console.error('Error adding collaborator:', error);
        res.status(500).json({ message: 'Error adding collaborator' });
    }
};

// Remove collaborator
exports.removeCollaborator = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the owner
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to remove collaborators' });
        }

        const { userId } = req.params;

        // Check if user is a collaborator
        if (!project.collaborators.includes(userId)) {
            return res.status(400).json({ message: 'User is not a collaborator' });
        }

        project.collaborators = project.collaborators.filter(c => c.toString() !== userId);
        await project.save();

        // Remove project from user's collaborations
        const user = await User.findById(userId);
        user.collaborations = user.collaborations.filter(c => c.toString() !== project._id.toString());
        await user.save();

        res.json({
            message: 'Collaborator removed successfully',
            project
        });
    } catch (error) {
        console.error('Error removing collaborator:', error);
        res.status(500).json({ message: 'Error removing collaborator' });
    }
};

// Request collaboration
exports.requestCollaboration = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is already a collaborator
        if (project.collaborators.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already a collaborator on this project' });
        }

        // Check if user has already requested collaboration
        const existingRequest = await Notification.findOne({
            project: project._id,
            fromUser: req.user._id,
            type: 'collaboration_request',
            read: false
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You have already requested collaboration on this project' });
        }

        // Create notification for project owner
        const notification = new Notification({
            user: project.owner,
            fromUser: req.user._id,
            project: project._id,
            type: 'collaboration_request',
            message: `${req.user.name} wants to collaborate on your project "${project.title}"`
        });

        await notification.save();

        res.json({ message: 'Collaboration request sent successfully' });
    } catch (error) {
        console.error('Error requesting collaboration:', error);
        res.status(500).json({ message: 'Error requesting collaboration' });
    }
};

// Handle collaboration request
exports.handleCollaborationRequest = async (req, res) => {
    try {
        const { projectId, userId, action } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the project owner
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only project owners can handle collaboration requests' });
        }

        const requester = await User.findById(userId);
        if (!requester) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (action === 'accept') {
            // Add user as collaborator
            if (!project.collaborators.includes(userId)) {
                project.collaborators.push(userId);
                await project.save();

                // Add project to user's collaborations
                requester.collaborations.push(projectId);
                await requester.save();

                // Create notification for requester
                const notification = new Notification({
                    user: userId,
                    fromUser: req.user._id,
                    project: projectId,
                    type: 'collaboration_accepted',
                    message: `Your collaboration request for "${project.title}" has been accepted`
                });
                await notification.save();
            }
        } else if (action === 'reject') {
            // Create notification for requester
            const notification = new Notification({
                user: userId,
                fromUser: req.user._id,
                project: projectId,
                type: 'collaboration_rejected',
                message: `Your collaboration request for "${project.title}" has been rejected`
            });
            await notification.save();
        }

        // Mark the original request notification as read
        await Notification.findOneAndUpdate(
            {
                project: projectId,
                fromUser: userId,
                type: 'collaboration_request',
                read: false
            },
            { read: true }
        );

        res.json({ message: `Collaboration request ${action}ed successfully` });
    } catch (error) {
        console.error('Error handling collaboration request:', error);
        res.status(500).json({ message: 'Error handling collaboration request' });
    }
}; 