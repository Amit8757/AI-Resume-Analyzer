import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        sparse: true, // Allow multiple null values for phone-only users
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        minlength: 6,
        select: false
    },
    // OAuth and Phone Auth fields
    provider: {
        type: String,
        enum: ['local', 'google', 'linkedin', 'github', 'phone'],
        default: 'local'
    },
    providerId: {
        type: String,
        sparse: true // Unique for each provider
    },
    // Phone Authentication
    phoneNumber: {
        type: String,
        sparse: true,
        trim: true
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    // OTP fields
    otpCode: {
        type: String,
        select: false
    },
    otpExpire: {
        type: Date,
        select: false
    },
    // Password Reset
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpire: {
        type: Date,
        select: false
    },
    // Profile
    avatar: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving (only for local auth)
userSchema.pre('save', async function (next) {
    // Skip if password is not modified or user is using OAuth/phone auth
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
