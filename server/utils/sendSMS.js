import twilio from 'twilio';
import crypto from 'crypto';

// Initialize Twilio client only if credentials are configured
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_account_sid_here') {
    twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✓ Twilio SMS configured');
} else {
    console.log('⊘ Twilio SMS not configured - phone auth will not work');
}

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP for storage
export const hashOTP = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

// Send OTP via SMS
export const sendOTP = async (phoneNumber, otp) => {
    if (!twilioClient) {
        throw new Error('SMS service not configured. Please add Twilio credentials to .env file');
    }

    try {
        const message = await twilioClient.messages.create({
            body: `Your AI Resume Analyzer verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this message.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        console.log(`OTP sent to ${phoneNumber}: ${message.sid}`);
        return { success: true, messageSid: message.sid };
    } catch (error) {
        console.error('Twilio error:', error);
        throw new Error('Failed to send OTP. Please check the phone number and try again.');
    }
};

// Verify OTP
export const verifyOTP = (enteredOTP, hashedOTP) => {
    const hashedEnteredOTP = hashOTP(enteredOTP);
    return hashedEnteredOTP === hashedOTP;
};
