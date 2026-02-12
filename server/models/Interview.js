import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobRole: {
        type: String,
        required: true,
        enum: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer', 'Marketing', 'Sales', 'General']
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    },
    difficulty: {
        type: String,
        default: 'Medium',
        enum: ['Easy', 'Medium', 'Hard']
    },
    questions: [{
        question: String,
        answer: String,
        answeredAt: Date
    }],
    status: {
        type: String,
        default: 'in-progress',
        enum: ['in-progress', 'completed']
    },
    feedback: {
        overallScore: {
            type: Number,
            min: 0,
            max: 100
        },
        strengths: [String],
        improvements: [String],
        detailedFeedback: String
    },
    completedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Interview', interviewSchema);
