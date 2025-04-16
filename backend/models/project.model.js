const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    techStack: [{
        type: String,
        required: true,
        trim: true
    }],
    lookingFor: [{
        type: String,
        required: true,
        trim: true
    }],
    githubLink: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for searching projects by tech stack
projectSchema.index({ techStack: 'text' });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 