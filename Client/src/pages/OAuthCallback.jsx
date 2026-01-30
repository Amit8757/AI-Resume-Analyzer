import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const provider = searchParams.get('provider');
            const error = searchParams.get('error');

            if (error) {
                toast.error(`OAuth login failed: ${error}`);
                navigate('/login');
                return;
            }

            if (!token) {
                toast.error('No authentication token received');
                navigate('/login');
                return;
            }

            try {
                // Store token
                localStorage.setItem('token', token);

                // Fetch user data
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    toast.success(`Welcome! Logged in with ${provider}`);
                    navigate('/app');
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error('OAuth callback error:', error);
                toast.error('Authentication failed. Please try again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        };

        handleCallback();
    }, [searchParams, navigate, login]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
            <div className="text-center">
                <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Completing sign in...
                </h2>
                <p className="text-slate-600">
                    Please wait while we log you in
                </p>
            </div>
        </div>
    );
};

export default OAuthCallback;
