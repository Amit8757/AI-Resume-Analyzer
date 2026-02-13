import express from 'express';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import { protect } from '../middleware/auth.js';
import { getInterviewQuestions, generateInterviewFeedback } from '../utils/interviewQuestions.js';

const router = express.Router();

// @route   POST /api/interviews
// @desc    Create new interview session
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { jobRole, difficulty, resumeId } = req.body;

        if (!jobRole) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a job role'
            });
        }

        let questionTexts = [];
        let resume = null;

        // Try to get AI generated questions if resumeId is provided
        if (resumeId) {
            // Validate if resumeId is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(resumeId)) {
                console.warn(`Invalid resumeId provided: ${resumeId}`);
            } else {
                resume = await Resume.findById(resumeId);

                if (resume && resume.user.toString() === req.user.id && resume.extractedText) {
                    try {
                        const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
                        console.log(`Requesting questions from AI Service: ${pythonServiceUrl}`);

                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

                        const aiResponse = await fetch(`${pythonServiceUrl}/generate-questions`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-Key': process.env.AI_SERVICE_API_KEY
                            },
                            body: JSON.stringify({
                                resumeText: resume.extractedText,
                                jobRole
                            }),
                            signal: controller.signal
                        });

                        clearTimeout(timeoutId);

                        if (aiResponse.ok) {
                            const aiData = await aiResponse.json();
                            if (aiData.success && aiData.questions && aiData.questions.length > 0) {
                                questionTexts = aiData.questions;
                                console.log(`Successfully generated ${questionTexts.length} questions via AI`);
                            }
                        } else {
                            const errorText = await aiResponse.text();
                            console.error(`AI Service error (${aiResponse.status}):`, errorText);
                        }
                    } catch (aiError) {
                        if (aiError.name === 'AbortError') {
                            console.error('AI Question Generation Timeout');
                        } else {
                            console.error('AI Question Generation Error:', aiError.message);
                        }
                        // Fallback to static questions below
                    }
                }
            }
        }

        // Fallback to static questions if AI fails or no resume
        if (questionTexts.length === 0) {
            console.log('Using fallback static questions');
            questionTexts = getInterviewQuestions(jobRole, 5);
        }

        const questions = questionTexts.map(q => ({ question: q, answer: '' }));

        // Create interview session
        const interview = await Interview.create({
            user: req.user.id,
            jobRole,
            resume: mongoose.Types.ObjectId.isValid(resumeId) ? resumeId : null,
            difficulty: difficulty || 'Medium',
            questions,
            status: 'in-progress'
        });

        res.status(201).json({
            success: true,
            interview
        });
    } catch (error) {
        console.error('Create interview error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating interview session: ' + error.message
        });
    }
});

// @route   GET /api/interviews
// @desc    Get user's interview history
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('-questions.answer'); // Don't send answers in list view

        res.status(200).json({
            success: true,
            count: interviews.length,
            interviews
        });
    } catch (error) {
        console.error('Get interviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interviews'
        });
    }
});

// @route   GET /api/interviews/:id
// @desc    Get specific interview session
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Make sure user owns interview
        if (interview.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this interview'
            });
        }

        res.status(200).json({
            success: true,
            interview
        });
    } catch (error) {
        console.error('Get interview error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interview'
        });
    }
});

// @route   PUT /api/interviews/:id/answer
// @desc    Submit answer to a question
// @access  Private
router.put('/:id/answer', protect, async (req, res) => {
    try {
        const { questionIndex, answer } = req.body;

        if (questionIndex === undefined || !answer) {
            return res.status(400).json({
                success: false,
                message: 'Please provide question index and answer'
            });
        }

        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Make sure user owns interview
        if (interview.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this interview'
            });
        }

        // Update answer
        if (questionIndex >= 0 && questionIndex < interview.questions.length) {
            interview.questions[questionIndex].answer = answer;
            interview.questions[questionIndex].answeredAt = new Date();
            await interview.save();

            res.status(200).json({
                success: true,
                interview
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid question index'
            });
        }
    } catch (error) {
        console.error('Submit answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting answer'
        });
    }
});

// @route   POST /api/interviews/:id/complete
// @desc    Complete interview and get feedback
// @access  Private
router.post('/:id/complete', protect, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Make sure user owns interview
        if (interview.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this interview'
            });
        }

        // Generate feedback
        const feedback = generateInterviewFeedback(interview.questions);

        // Update interview
        interview.status = 'completed';
        interview.feedback = feedback;
        interview.completedAt = new Date();
        await interview.save();

        res.status(200).json({
            success: true,
            interview
        });
    } catch (error) {
        console.error('Complete interview error:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing interview'
        });
    }
});

// @route   DELETE /api/interviews/:id
// @desc    Delete interview session
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Make sure user owns interview
        if (interview.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this interview'
            });
        }

        await interview.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Interview deleted successfully'
        });
    } catch (error) {
        console.error('Delete interview error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting interview'
        });
    }
});

export default router;
