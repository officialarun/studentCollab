const HackathonTeam = require('../models/hackathonTeam.model');
const Notification = require('../models/notification.model');

// Create a new hackathon team
exports.createTeam = async (req, res) => {
    try {
        const { hackathonName, teamName, teamSize, vacantPositions, requiredTechStack, specificRequirements } = req.body;

        const team = new HackathonTeam({
            hackathonName,
            teamName,
            owner: req.user._id,
            teamSize,
            vacantPositions,
            requiredTechStack,
            specificRequirements,
            teamMembers: [{
                user: req.user._id,
                position: 'Team Lead'
            }]
        });

        await team.save();
        res.status(201).json(team);
    } catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({ message: 'Error creating team' });
    }
};

// Get all hackathon teams
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await HackathonTeam.find()
            .populate('owner', 'name email')
            .populate('teamMembers.user', 'name email techStack');
        res.json(teams);
    } catch (error) {
        console.error('Get teams error:', error);
        res.status(500).json({ message: 'Error fetching teams' });
    }
};

// Get teams owned by user
exports.getMyTeams = async (req, res) => {
    try {
        const teams = await HackathonTeam.find({ owner: req.user._id })
            .populate('owner', 'name email')
            .populate('teamMembers.user', 'name email techStack');
        res.json(teams);
    } catch (error) {
        console.error('Get my teams error:', error);
        res.status(500).json({ message: 'Error fetching your teams' });
    }
};

// Get teams user is a member of
exports.getTeamsImIn = async (req, res) => {
    try {
        const teams = await HackathonTeam.find({
            'teamMembers.user': req.user._id
        })
            .populate('owner', 'name email')
            .populate('teamMembers.user', 'name email techStack')
            .populate('joinRequests.user', 'name email techStack');

        console.log('Found teams:', teams);
        res.json(teams);
    } catch (error) {
        console.error('Get teams I\'m in error:', error);
        res.status(500).json({ message: 'Error fetching teams' });
    }
};

// Request to join team
exports.requestToJoin = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const { position } = req.body;
        console.log('Request to join team:', { teamId, position, userId: req.user._id });
        
        // Log the request object
        console.log('Request object:', {
            params: req.params,
            body: req.body,
            user: req.user
        });
        
        // Log MongoDB query
        console.log('Searching for team with ID:', teamId);
        const team = await HackathonTeam.findById(teamId).populate('owner', 'name email');
        console.log('Found team:', team ? 'Yes' : 'No');
        if (team) {
            console.log('Team details:', {
                id: team._id,
                name: team.teamName,
                owner: team.owner,
                members: team.teamMembers
            });
        }

        if (!team) {
            console.log('Team not found with ID:', teamId);
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is already a member
        const isMember = team.teamMembers.some(member => member.user.toString() === req.user._id.toString());
        console.log('Is user already a member:', isMember);
        if (isMember) {
            return res.status(400).json({ message: 'You are already a team member' });
        }

        // Add join request
        console.log('Adding join request for user:', req.user._id);
        team.joinRequests.push({
            user: req.user._id,
            position,
            status: 'pending'
        });

        await team.save();
        console.log('Team saved successfully');

        // Create notification for team owner
        console.log('Creating notification for team owner:', team.owner);
        const notification = new Notification({
            user: team.owner._id,
            fromUser: req.user._id,
            team: team._id,
            type: 'hackathon_join_request',
            message: `${req.user.name} wants to join your team ${team.teamName} for ${team.hackathonName}`,
            status: 'pending'
        });

        await notification.save();
        console.log('Notification saved successfully');

        res.json({ message: 'Join request sent successfully' });
    } catch (error) {
        console.error('Request to join error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: 'Error sending join request', error: error.message });
    }
};

// Handle join request (accept/reject)
exports.handleJoinRequest = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId, action } = req.body;
        const teamOwnerId = req.user._id;

        console.log('Handling join request:', { teamId, userId, action, teamOwnerId });

        // Find the team
        const team = await HackathonTeam.findById(teamId)
            .populate('owner', 'name email')
            .populate('teamMembers.user', 'name email');

        if (!team) {
            console.log('Team not found:', teamId);
            return res.status(404).json({ message: 'Team not found' });
        }

        // Verify the current user is the team owner
        if (team.owner._id.toString() !== teamOwnerId.toString()) {
            console.log('User is not team owner:', { teamOwner: team.owner._id, currentUser: teamOwnerId });
            return res.status(403).json({ message: 'Only team owner can handle join requests' });
        }

        // Find the join request
        const joinRequest = team.joinRequests.find(
            request => request.user.toString() === userId && request.status === 'pending'
        );

        if (!joinRequest) {
            console.log('Join request not found:', { teamId, userId });
            return res.status(404).json({ message: 'Join request not found' });
        }

        if (action === 'accept') {
            // Add user to team members
            team.teamMembers.push({
                user: userId,
                position: joinRequest.position,
                joinedAt: new Date()
            });

            // Update join request status
            joinRequest.status = 'accepted';
            joinRequest.respondedAt = new Date();

            // Create notification for the accepted user
            await Notification.create({
                user: userId,
                type: 'hackathon_request_accepted',
                message: `Your request to join ${team.teamName} for ${team.hackathonName} has been accepted!`,
                teamId: team._id,
                status: 'accepted'
            });

            console.log('Join request accepted:', { teamId, userId });
        } else if (action === 'reject') {
            // Update join request status
            joinRequest.status = 'rejected';
            joinRequest.respondedAt = new Date();

            // Create notification for the rejected user
            await Notification.create({
                user: userId,
                type: 'hackathon_request_rejected',
                message: `Your request to join ${team.teamName} for ${team.hackathonName} has been rejected.`,
                teamId: team._id,
                status: 'rejected'
            });

            console.log('Join request rejected:', { teamId, userId });
        }

        // Save the updated team
        await team.save();

        res.json({
            success: true,
            message: `Join request ${action}ed successfully`,
            team
        });
    } catch (error) {
        console.error('Handle join request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error handling join request',
            error: error.message
        });
    }
};

// Get team details
exports.getTeamDetails = async (req, res) => {
    try {
        const team = await HackathonTeam.findById(req.params.id)
            .populate('owner', 'name email techStack')
            .populate('teamMembers.user', 'name email techStack')
            .populate('joinRequests.user', 'name email techStack');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        console.error('Get team details error:', error);
        res.status(500).json({ message: 'Error fetching team details' });
    }
};

// Clean up stale join requests and create notifications
exports.cleanupJoinRequests = async (req, res) => {
    try {
        console.log('Starting cleanup of join requests...');
        const teams = await HackathonTeam.find({
            'joinRequests.status': 'pending'
        }).populate('owner', 'name email');

        console.log('Found teams with pending requests:', teams.length);
        let cleanedUpCount = 0;
        let notificationCount = 0;

        for (const team of teams) {
            for (const request of team.joinRequests) {
                if (request.status === 'pending') {
                    // Check if notification exists
                    const existingNotification = await Notification.findOne({
                        type: 'hackathon_join_request',
                        teamId: team._id,
                        fromUser: request.user,
                        user: team.owner._id
                    });

                    if (!existingNotification) {
                        // Create notification
                        const notification = new Notification({
                            user: team.owner._id,
                            fromUser: request.user,
                            teamId: team._id,
                            type: 'hackathon_join_request',
                            message: `A user wants to join your team ${team.teamName} for ${team.hackathonName}`,
                            status: 'pending'
                        });

                        await notification.save();
                        notificationCount++;
                        console.log('Created notification for team:', team.teamName);
                    }
                }
            }
        }

        console.log('Cleanup completed. Notifications created:', notificationCount);
        res.status(200).json({
            success: true,
            message: 'Cleanup completed',
            notificationsCreated: notificationCount
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during cleanup',
            error: error.message
        });
    }
};

// Reset all join requests (for testing)
exports.resetJoinRequests = async (req, res) => {
    try {
        console.log('Resetting all join requests...');
        
        // Update all teams to clear their join requests
        const result = await HackathonTeam.updateMany(
            {},
            { $set: { joinRequests: [] } }
        );
        
        console.log('Reset result:', result);
        
        // Also delete all hackathon-related notifications
        const notificationResult = await Notification.deleteMany({
            type: { $in: ['hackathon_join_request', 'hackathon_request_accepted', 'hackathon_request_rejected'] }
        });
        
        console.log('Notification deletion result:', notificationResult);
        
        res.json({
            success: true,
            message: 'All join requests have been reset',
            teamsUpdated: result.modifiedCount,
            notificationsDeleted: notificationResult.deletedCount
        });
    } catch (error) {
        console.error('Reset join requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting join requests',
            error: error.message
        });
    }
}; 