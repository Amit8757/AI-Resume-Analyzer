import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

console.log('--- OAuth Router Loaded ---');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @route   GET /api/oauth/debug
// @desc    Debug passport strategies
// @access  Public
router.get('/debug', (req, res) => {
    res.json({
        strategies: Object.keys(passport._strategies),
        env: {
            hasClientId: !!process.env.GOOGLE_CLIENT_ID,
            clientIdStart: process.env.GOOGLE_CLIENT_ID?.substring(0, 10),
            callbackUrl: process.env.GOOGLE_CALLBACK_URL
        }
    });
});

// @route   GET /api/oauth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', (req, res, next) => {
    console.log('GET /api/oauth/google called');
    console.log('Strategies registered:', Object.keys(passport._strategies));
    next();
}, passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/test', (req, res) => {
    res.send('OAuth Router is working!');
});

// @route   GET /api/oauth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
    (req, res) => {
        // Generate JWT token
        const token = generateToken(req.user._id);

        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&provider=google`);
    }
);

// @route   GET /api/oauth/linkedin
// @desc    Initiate LinkedIn OAuth
// @access  Public
router.get('/linkedin', passport.authenticate('linkedin', {
    scope: ['r_emailaddress', 'r_liteprofile']
}));

// @route   GET /api/oauth/linkedin/callback
// @desc    LinkedIn OAuth callback
// @access  Public
router.get('/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
    (req, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&provider=linkedin`);
    }
);

// @route   GET /api/oauth/github
// @desc    Initiate GitHub OAuth
// @access  Public
router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

// @route   GET /api/oauth/github/callback
// @desc    GitHub OAuth callback
// @access  Public
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
    (req, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&provider=github`);
    }
);

export default router;
