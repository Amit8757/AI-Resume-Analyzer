import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Loader, CheckCircle } from 'lucide-react';
import { resetPassword } from '../services/authService';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, password);
            setSuccess(true);
            toast.success('Password reset successful!');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid or expired reset token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {!success ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="text-blue-600" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                    Reset Password
                                </h2>
                                <p className="text-slate-600">
                                    Enter your new password below
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Must be at least 6 characters
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
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
                                            Resetting...
                                        </>
                                    ) : (
                                        'Reset Password'
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
                                    Password Reset!
                                </h2>
                                <p className="text-slate-600 mb-6">
                                    Your password has been successfully reset.
                                </p>
                                <p className="text-sm text-slate-500">
                                    Redirecting to login...
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
