import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Resume from '../models/Resume.js';
import { protect } from '../middleware/auth.js';
import { extractTextFromPDF, extractKeywords, checkResumeSections } from '../utils/resumeParser.js';
import { calculateATSScore } from '../utils/atsScorer.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/resumes';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// @route   POST /api/resumes/upload
// @desc    Upload a resume
// @access  Private
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF file'
            });
        }

        // Extract text from PDF
        const extractedText = await extractTextFromPDF(req.file.path);

        // Create resume record
        const resume = await Resume.create({
            user: req.user.id,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            extractedText
        });

        res.status(201).json({
            success: true,
            resume: {
                id: resume._id,
                originalName: resume.originalName,
                fileSize: resume.fileSize,
                createdAt: resume.createdAt
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading resume'
        });
    }
});

// @route   GET /api/resumes
// @desc    Get all user resumes
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('-extractedText');

        res.status(200).json({
            success: true,
            count: resumes.length,
            resumes
        });
    } catch (error) {
        console.error('Get resumes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching resumes'
        });
    }
});

// @route   GET /api/resumes/:id
// @desc    Get single resume
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Make sure user owns resume
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this resume'
            });
        }

        res.status(200).json({
            success: true,
            resume
        });
    } catch (error) {
        console.error('Get resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching resume'
        });
    }
});

// @route   PUT /api/resumes/:id/analyze
// @desc    Analyze resume against job description
// @access  Private
router.put('/:id/analyze', protect, async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a job description'
            });
        }

        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Make sure user owns resume
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this resume'
            });
        }

        // Check resume sections
        const resumeSections = checkResumeSections(resume.extractedText);

        // Calculate ATS score
        const analysis = calculateATSScore(resume.extractedText, jobDescription, resumeSections);

        // Update resume with analysis
        resume.analysis = {
            atsScore: analysis.atsScore,
            jobDescription,
            keywordsMatched: analysis.keywordsMatched,
            suggestions: analysis.suggestions,
            analyzedAt: new Date()
        };

        await resume.save();

        res.status(200).json({
            success: true,
            analysis: resume.analysis
        });
    } catch (error) {
        console.error('Analyze resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing resume'
        });
    }
});

// @route   PUT /api/resumes/:id/optimize
// @desc    Optimize resume using AI (Python microservice)
// @access  Private
router.put('/:id/optimize', protect, async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a job description'
            });
        }

        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Make sure user owns resume
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this resume'
            });
        }

        if (!resume.extractedText) {
            return res.status(400).json({
                success: false,
                message: 'Resume text not available. Please re-upload.'
            });
        }

        // Call Python AI microservice
        const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
        const response = await fetch(`${pythonServiceUrl}/optimize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.AI_SERVICE_API_KEY
            },
            body: JSON.stringify({
                resumeText: resume.extractedText,
                jobDescription
            })
        });

        const data = await response.json();

        if (!data.success) {
            return res.status(500).json({
                success: false,
                message: data.error || 'AI optimization failed'
            });
        }

        // Save optimized resume
        resume.optimizedResume = data.optimizedResume;
        resume.optimizedAt = new Date();
        await resume.save();

        res.status(200).json({
            success: true,
            optimizedResume: data.optimizedResume,
            optimizedAt: resume.optimizedAt
        });
    } catch (error) {
        console.error('Optimize resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Error optimizing resume. Make sure the AI service is running.'
        });
    }
});

// @route   DELETE /api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Make sure user owns resume
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this resume'
            });
        }

        // Delete file from filesystem
        if (fs.existsSync(resume.filePath)) {
            fs.unlinkSync(resume.filePath);
        }

        // Delete resume from database
        await resume.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully'
        });
    } catch (error) {
        console.error('Delete resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting resume'
        });
    }
});

export default router;
