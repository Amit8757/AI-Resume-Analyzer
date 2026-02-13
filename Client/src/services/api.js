import axios from 'axios';

// Create axios instance with base URL
let baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
    if (import.meta.env.PROD) {
        // In production, fallback to /api (unified) OR warn if it's likely a split deployment
        baseURL = '/api';
        console.warn('WARNING: VITE_API_URL is NOT set in Production.');
        console.warn('Falling back to relative path "/api". This will FAIL if frontend and backend are on different URLs.');
    } else {
        baseURL = 'http://localhost:5000/api';
    }
}

if (import.meta.env.PROD) {
    console.log('API Service initialized in Production mode');
    console.log('Final Base URL being used:', baseURL);
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
