import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/passport.js';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import interviewRoutes from './routes/interview.js';
import oauthRoutes from './routes/oauth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/interviews', interviewRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'AI Resume Analyzer API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// DEBUG ROUTE - Remove before final
app.get('/api/debug-paths', async (req, res) => {
    try {
        const fs = await import('fs');
        const rootPath = path.resolve(__dirname, '..');
        const clientPath = path.resolve(rootPath, 'Client');
        const buildPath = path.resolve(clientPath, 'build');

        const info = {
            __dirname,
            rootPath,
            clientPath,
            buildPath,
            rootExists: fs.default.existsSync(rootPath),
            clientExists: fs.default.existsSync(clientPath),
            buildExists: fs.default.existsSync(buildPath),
            rootContents: fs.default.readdirSync(rootPath),
            clientContents: fs.default.existsSync(clientPath) ? fs.default.readdirSync(clientPath) : [],
            buildContents: fs.default.existsSync(buildPath) ? fs.default.readdirSync(buildPath) : []
        };

        res.json(info);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../Client/build');
    const indexHtml = path.resolve(frontendPath, 'index.html');

    console.log('Production mode detected');
    console.log('Expected static files directory:', frontendPath);

    // Serve static files
    app.use(express.static(frontendPath));

    // Catch-all route to serve the SPA
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }

        res.sendFile(indexHtml, (err) => {
            if (err) {
                console.error('Error sending index.html:', err.message);
                res.status(404).json({
                    success: false,
                    message: "Frontend build not found. Please check deployment logs.",
                    path: indexHtml
                });
            }
        });
    });
}

// 404 handler for API or missing production files
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    });
};

startServer();
