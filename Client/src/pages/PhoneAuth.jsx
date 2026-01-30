import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, ArrowLeft, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendOTP, verifyOTP, resendOTP } from '../services/authService';
import { toast } from 'react-toastify';

const PhoneAuth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const [step, setStep] = useState(1); // 1: phone input, 2: OTP verification
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!phoneNumber) {
            toast.error('Please enter your phone number');
            return;
        }

        // Basic validation for phone number format
        if (!phoneNumber.startsWith('+')) {
            toast.error('Please include country code (e.g., +1 for US)');
            return;
        }

        setLoading(true);
        try {
            await sendOTP(phoneNumber);
            toast.success('OTP sent to your phone number');
            setStep(2);
            setResendTimer(60); // 60 seconds cooldown
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        if (!name) {
            toast.error('Please enter your name');
            return;
        }

        setLoading(true);
        try {
            const data = await verifyOTP(phoneNumber, otp, name);
            login(data.user, data.token);
            toast.success('Login successful!');

            const redirect = searchParams.get('redirect') || '/app';
            navigate(redirect);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setLoading(true);
        try {
            await resendOTP(phoneNumber);
            toast.success('OTP resent successfully');
            setResendTimer(60);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error resending OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Back Button */}
                <button
                    onClick={() => step === 1 ? navigate('/login') : setStep(1)}
                    className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="text-blue-600" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">
                            {step === 1 ? 'Phone Login' : 'Verify OTP'}
                        </h2>
                        <p className="text-slate-600">
                            {step === 1
                                ? 'Enter your phone number to receive a verification code'
                                : `We sent a code to ${phoneNumber}`
                            }
                        </p>
                    </div>

                    {/* Step 1: Phone Number Input */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+1 234 567 8900"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Include country code (e.g., +1 for US, +91 for India)
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Sending OTP...
                                    </>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit code"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-semibold"
                                    maxLength={6}
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify & Login'
                                )}
                            </button>

                            {/* Resend OTP */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resendTimer > 0 || loading}
                                    className="text-blue-600 hover:text-blue-700 font-medium disabled:text-slate-400 disabled:cursor-not-allowed"
                                >
                                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-600">
                            Prefer email?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Login with Email
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneAuth;
