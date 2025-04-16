const express = require('express');
const router = express.Router();
const hackathonTeamController = require('../controllers/hackathonTeam.controller');
const auth = require('../middleware/auth');

// Create a new hackathon team
router.post('/', auth, hackathonTeamController.createTeam);

// Get all hackathon teams
router.get('/', auth, hackathonTeamController.getAllTeams);

// Get teams owned by user
router.get('/my-teams', auth, hackathonTeamController.getMyTeams);

// Get teams user is a member of
router.get('/teams-im-in', auth, hackathonTeamController.getTeamsImIn);

// Reset all join requests (for testing)
router.post('/reset-requests', auth, hackathonTeamController.resetJoinRequests);

// Clean up stale join requests and create notifications
router.post('/cleanup-requests', auth, hackathonTeamController.cleanupJoinRequests);

// Request to join team
router.post('/:teamId/join-request', auth, hackathonTeamController.requestToJoin);

// Handle join request
router.post('/:teamId/handle-request', auth, hackathonTeamController.handleJoinRequest);

// Get team details
router.get('/:id', auth, hackathonTeamController.getTeamDetails);

module.exports = router; 