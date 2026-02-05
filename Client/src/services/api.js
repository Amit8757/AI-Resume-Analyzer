import axios from 'axios';

// Create axios instance with base URL
let baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'https://ai-resume-analyzer-8eki.onrender.com/api');

// Auto-fix: Ensure /api suffix if it's an absolute URL and it's missing
if (baseURL.startsWith('http') && !baseURL.endsWith('/api') && !baseURL.includes('/api/')) {
    baseURL = baseURL.replace(/\/$/, '') + '/api';
}

if (import.meta.env.PROD) {
    console.log('API Service initialized in Production mode');
    console.log('Final Base URL being used:', baseURL);
}

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
