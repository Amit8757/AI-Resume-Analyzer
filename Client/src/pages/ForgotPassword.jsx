import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../services/authService';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email);
            setEmailSent(true);
            toast.success('Password reset email sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Back Button */}
                <Link
                    to="/login"
                    className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Login</span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {!emailSent ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="text-blue-600" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                    Forgot Password?
                                </h2>
                                <p className="text-slate-600">
                                    No worries! Enter your email and we'll send you reset instructions.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-600" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                    Check Your Email
                                </h2>
                                <p className="text-slate-600 mb-6">
                                    We've sent password reset instructions to <strong>{email}</strong>
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-slate-700">
                                        📧 Didn't receive the email? Check your spam folder or{' '}
                                        <button
                                            onClick={() => setEmailSent(false)}
                                            className="text-blue-600 hover:text-blue-700 font-semibold"
                                        >
                                            try again
                                        </button>
                                    </p>
                                </div>
                                <Link
                                    to="/login"
                                    className="inline-block w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
