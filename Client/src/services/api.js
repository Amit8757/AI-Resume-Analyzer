import axios from 'axios';

// Create axios instance with base URL
let baseURL = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD) {
    console.log('[API CONFIG]: Build Environment: Production');
    if (!baseURL) {
        console.error('[API CONFIG]: ERROR - VITE_API_URL is undefined.');
        console.warn('[API CONFIG]: Falling back to relative path "/api". This WILL FAIL on split Render deployments.');
        baseURL = '/api';
    } else {
        console.log('[API CONFIG]: VITE_API_URL detected:', baseURL);
    }
} else {
    baseURL = baseURL || 'http://localhost:5000/api';
}

// Ensure /api suffix
if (baseURL && baseURL.startsWith('http') && !baseURL.endsWith('/api') && !baseURL.includes('/api/')) {
    baseURL = baseURL.replace(/\/$/, '') + '/api';
}

export const API_BASE_URL = baseURL;

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
