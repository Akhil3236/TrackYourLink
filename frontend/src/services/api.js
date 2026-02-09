import axios from 'axios';
import { API_CONFIG, getAuthHeader } from '../config/api';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const authHeader = getAuthHeader();
        if (authHeader.Authorization) {
            config.headers.Authorization = authHeader.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;

        // Handle unauthorized (401) or forbidden (403) errors
        if (status === 401 || status === 403) {
            // Only redirect if not already on login/register pages to avoid loops
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                localStorage.removeItem('token');
                // Use a slight delay to allow toast or other cleanup if needed, but here simple redirect is safer
                window.location.href = '/login?expired=true';
            }
        }
        return Promise.reject(error.response?.data || { message: error.message });
    }
);

export default api;
