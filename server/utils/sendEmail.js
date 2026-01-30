import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
    const transporter = createTransporter();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset Request - AI Resume Analyzer',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hi there,</p>
                        <p>You requested to reset your password for your AI Resume Analyzer account.</p>
                        <p>Click the button below to reset your password:</p>
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="background: #fff; padding: 10px; border-radius: 5px; word-break: break-all;">${resetUrl}</p>
                        <p><strong>This link will expire in 10 minutes.</strong></p>
                        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                    </div>
                    <div class="footer">
                        <p>© 2026 AI Resume Analyzer. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email send error:', error);
        throw new Error('Error sending email');
    }
};

// Generate password reset token
export const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hash token for storage
export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};
