const express = require('express');
const router = express.Router();
const collaborationRequestController = require('../controllers/collaborationRequest.controller');
const auth = require('../middleware/auth');

// Create a new collaboration request
router.post('/projects/:projectId/collaboration-requests', auth, collaborationRequestController.createRequest);

// Get all collaboration requests for a project
router.get('/projects/:projectId/collaboration-requests', auth, collaborationRequestController.getProjectRequests);

// Get all collaboration requests for the current user
router.get('/users/requests', auth, collaborationRequestController.getUserRequests);

// Accept a collaboration request
router.put('/collaboration-requests/:requestId/accept', auth, collaborationRequestController.acceptRequest);

// Reject a collaboration request
router.put('/collaboration-requests/:requestId/reject', auth, collaborationRequestController.rejectRequest);

module.exports = router; 