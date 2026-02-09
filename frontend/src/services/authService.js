import api from './api';
import { API_CONFIG } from '../config/api';

export const authService = {
    register: async (userData) => {
        const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
        if (response.token) {
            localStorage.setItem('token', response.token);
        }
        return response;
    },

    login: async (credentials) => {
        const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
        if (response.token) {
            localStorage.setItem('token', response.token);
        }
        return response;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        return await api.get(API_CONFIG.ENDPOINTS.DASHBOARD);
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};
