import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
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
// Load env variables
// --------------------
dotenv.config();

// --------------------
// Initialize app
// --------------------
const app = express();

// --------------------
// CORS CONFIG (VERY IMPORTANT)
// --------------------
const allowedOrigins = [
    process.env.CLIENT_URL,          // Render frontend URL
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174"
]
    .filter(Boolean)
    .map(url => url.replace(/\/$/, ""));

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            const normalizedOrigin = origin.replace(/\/$/, "");
            if (allowedOrigins.includes(normalizedOrigin)) {
                callback(null, true);
            } else {
                console.warn("[CORS BLOCKED]:", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
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
        secret: process.env.SESSION_SECRET || "fallback-secret",
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
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
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
// Serve frontend ONLY if built locally
// --------------------
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../Client/dist");

    try {
        const fs = await import("fs");

        if (fs.default.existsSync(frontendPath)) {
            app.use(express.static(frontendPath));

            app.get("*", (req, res, next) => {
                if (req.path.startsWith("/api")) return next();
                res.sendFile(path.join(frontendPath, "index.html"));
            });
        } else {
            console.log("Frontend not found. Assuming separate frontend deployment.");
        }
    } catch (err) {
        console.error("Static serving error:", err);
    }
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
