import api from './api';
import { API_CONFIG } from '../config/api';

export const linkService = {
    createLink: async (linkData) => {
        return await api.post(API_CONFIG.ENDPOINTS.CREATE_LINK, linkData);
    },

    getAllLinks: async () => {
        return await api.get(API_CONFIG.ENDPOINTS.GET_ALL_LINKS);
    },

    getAnalytics: async (slug) => {
        return await api.get(API_CONFIG.ENDPOINTS.GET_ANALYTICS(encodeURIComponent(slug)));
    },

    deleteLink: async (slug) => {
        return await api.delete(`/api/links/${encodeURIComponent(slug)}`);
    }
};
