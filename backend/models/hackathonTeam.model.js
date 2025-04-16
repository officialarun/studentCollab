const mongoose = require('mongoose');

const hackathonTeamSchema = new mongoose.Schema({
    hackathonName: {
        type: String,
        required: true,
        trim: true
    },
    teamName: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teamSize: {
        type: Number,
        required: true,
        min: 1
    },
    currentSize: {
        type: Number,
        default: 1
    },
    vacantPositions: [{
        position: {
            type: String,
            required: true,
            trim: true
        },
        required: {
            type: Boolean,
            default: true
        }
    }],
    requiredTechStack: [{
        type: String,
        trim: true
    }],
    specificRequirements: {
        type: String,
        trim: true
    },
    teamMembers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        position: {
            type: String,
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    joinRequests: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        position: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        requestedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const HackathonTeam = mongoose.model('HackathonTeam', hackathonTeamSchema);

module.exports = HackathonTeam; 