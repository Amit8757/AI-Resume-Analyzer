import api from './api';

/**
 * Register a new user
 */
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

/**
 * Login user
 */
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

/**
 * Logout user
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

/**
 * Get user from localStorage
 */
export const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phoneNumber) => {
    const response = await api.post('/auth/send-otp', { phoneNumber });
    return response.data;
};

/**
 * Verify OTP and login/register
 */
export const verifyOTP = async (phoneNumber, otp, name) => {
    const response = await api.post('/auth/verify-otp', { phoneNumber, otp, name });
    if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

/**
 * Resend OTP
 */
export const resendOTP = async (phoneNumber) => {
    const response = await api.post('/auth/resend-otp', { phoneNumber });
    return response.data;
};

/**
 * Request password reset
 */
export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

/**
 * Update password (for logged in users)
 */
export const updatePassword = async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', { currentPassword, newPassword });
    return response.data;
};

/**
 * Initiate OAuth login
 */
export const oauthLogin = (provider) => {
    // Redirect to backend OAuth endpoint
    // Logic: Use VITE_API_URL's root if available, otherwise relative or localhost
    let baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || (import.meta.env.PROD ? '' : 'http://localhost:5000');

    // Normalize if it ends with slash
    baseUrl = baseUrl.replace(/\/$/, "");

    window.location.href = `${baseUrl}/api/oauth/${provider}`;
};
