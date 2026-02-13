import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";
import interviewRoutes from "./routes/interview.js";
import oauthRoutes from "./routes/oauth.js";

// --------------------
// Setup dirname (ESM)
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// Initialize app
// --------------------
const app = express();

// --------------------
// CORS CONFIG (VERY IMPORTANT)
// --------------------
const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://ai-resume-analyzer-1-vz59.onrender.com", // Explicitly trust the Render frontend
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174"
]
    .filter(Boolean)
    .map(url => url.replace(/\/$/, ""));

app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            const normalizedOrigin = origin.replace(/\/$/, "");

            // Check if origin is in allowed list OR is an onrender.com subdomain
            const isAllowed = allowedOrigins.includes(normalizedOrigin) ||
                normalizedOrigin.endsWith(".onrender.com");

            if (isAllowed) {
                callback(null, true);
            } else {
                console.warn("[CORS REJECTED]:", origin);
                // CRITICAL: Return (null, false) instead of Error to avoid 500 crash
                callback(null, false);
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// ✅ Handle preflight requests
app.options("*", cors());

// --------------------
// Body parsers
// --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// Session config
// --------------------
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    })
);

// --------------------
// Passport init
// --------------------
app.use(passport.initialize());
app.use(passport.session());

// --------------------
// API Routes
// --------------------
console.log('Mounting API routes...');
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
console.log('OAuth routes mounted at /api/oauth');
app.use("/api/resumes", resumeRoutes);
app.use("/api/interviews", interviewRoutes);

// --------------------
// Health check
// --------------------
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Resume Analyzer API is running",
        environment: process.env.NODE_ENV,
        time: new Date().toISOString()
    });
});

// --------------------
// Serve frontend
// --------------------
const frontendPath = path.join(__dirname, "../Client/dist");

// Standard built-in fs is needed for sync check
import fs from "fs";

if (fs.existsSync(frontendPath)) {
    console.log("Serving frontend from:", frontendPath);
    app.use(express.static(frontendPath));

    // CATCH-ALL ROUTE: Redirect all non-API GET requests to index.html
    // This allows React Router to handle URLs like /app, /login, etc. on refresh
    app.get("*", (req, res, next) => {
        // Skip for API routes
        if (req.path.startsWith("/api")) return next();

        // Skip for file extensions (images, scripts, etc.) if they weren't found in express.static
        if (path.extname(req.path)) return next();

        res.sendFile(path.join(frontendPath, "index.html"));
    });
} else {
    console.warn("WARNING: Frontend 'dist' folder not found at:", frontendPath);
    console.warn("If this is production, ensure you have run 'npm run build' in the Client directory.");
}

// --------------------
// 404 handler
// --------------------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
});

// --------------------
// Global error handler
// --------------------
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err.message);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// --------------------
// MongoDB Connection
// --------------------
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected:", conn.connection.host);
    } catch (error) {
        console.error("MongoDB Error:", error.message);
        process.exit(1);
    }
};

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    });
};

startServer();
