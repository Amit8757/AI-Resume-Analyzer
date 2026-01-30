import express from 'express';
import jwt from 'jsonwebtoken';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { generateOTP, hashOTP, sendOTP, verifyOTP } from '../utils/sendSMS.js';
import { sendPasswordResetEmail, generateResetToken, hashToken } from '../utils/sendEmail.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                provider: user.provider,
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a phone number'
            });
        }

        // Validate phone number
        if (!isValidPhoneNumber(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number with country code'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const hashedOTP = hashOTP(otp);

        // Find or create user with phone number
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            // Create temporary user record
            user = new User({
                phoneNumber,
                provider: 'phone',
                name: 'User', // Temporary name, will be updated later
                otpCode: hashedOTP,
                otpExpire: Date.now() + 10 * 60 * 1000 // 10 minutes
            });
        } else {
            user.otpCode = hashedOTP;
            user.otpExpire = Date.now() + 10 * 60 * 1000;
        }

        await user.save({ validateBeforeSave: false });

        // Send OTP via SMS
        await sendOTP(phoneNumber, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your phone number'
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error sending OTP'
        });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        const { phoneNumber, otp, name } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone number and OTP'
            });
        }

        // Find user
        const user = await User.findOne({ phoneNumber }).select('+otpCode +otpExpire');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No OTP request found for this phone number'
            });
        }

        // Check if OTP expired
        if (user.otpExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one'
            });
        }

        // Verify OTP
        const isValid = verifyOTP(otp, user.otpCode);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Update user
        user.phoneVerified = true;
        user.otpCode = undefined;
        user.otpExpire = undefined;

        // Update name if provided (for new users)
        if (name && user.name === 'User') {
            user.name = name;
        }

        await user.save({ validateBeforeSave: false });

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                provider: user.provider
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying OTP'
        });
    }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP
// @access  Public
router.post('/resend-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a phone number'
            });
        }

        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No account found with this phone number'
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const hashedOTP = hashOTP(otp);

        user.otpCode = hashedOTP;
        user.otpExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // Send OTP
        await sendOTP(phoneNumber, otp);

        res.status(200).json({
            success: true,
            message: 'OTP resent successfully'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resending OTP'
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const hashedToken = hashToken(resetToken);

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        // Send email
        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending password reset email'
        });
    }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const resetToken = req.params.token;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a new password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Hash token to compare
        const hashedToken = hashToken(resetToken);

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+resetPasswordToken +resetPasswordExpire');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Generate new token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
});

// @route   PUT /api/auth/update-password
// @desc    Update password (for logged in users)
// @access  Private
router.put('/update-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check if user has a password (not OAuth user)
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update password for OAuth accounts'
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating password'
        });
    }
});

export default router;
