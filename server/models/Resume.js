import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    extractedText: {
        type: String,
        default: ''
    },
    analysis: {
        atsScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        jobDescription: {
            type: String,
            default: ''
        },
        keywordsMatched: [{
            keyword: String,
            found: Boolean
        }],
        suggestions: [{
            type: String
        }],
        analyzedAt: {
            type: Date
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Resume', resumeSchema);
