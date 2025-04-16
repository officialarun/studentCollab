const mongoose = require('mongoose');

const collaborationRequestSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    message: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
collaborationRequestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient querying
collaborationRequestSchema.index({ project: 1, user: 1 }, { unique: true });
collaborationRequestSchema.index({ user: 1, status: 1 });

const CollaborationRequest = mongoose.model('CollaborationRequest', collaborationRequestSchema);

module.exports = CollaborationRequest; 