const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth');

// Get all projects
router.get('/', projectController.getAllProjects);

// Get single project
router.get('/:id', projectController.getProject);

// Create project (protected)
router.post('/', auth, projectController.createProject);

// Update project (protected)
router.put('/:id', auth, projectController.updateProject);

// Delete project (protected)
router.delete('/:id', auth, projectController.deleteProject);

// Add collaborator (protected)
router.post('/:id/collaborators', auth, projectController.addCollaborator);

// Remove collaborator (protected)
router.delete('/:id/collaborators/:userId', auth, projectController.removeCollaborator);

// Request collaboration
router.post('/:id/request-collaboration', auth, projectController.requestCollaboration);

// Handle collaboration request
router.post('/handle-collaboration-request', auth, projectController.handleCollaborationRequest);

module.exports = router; 