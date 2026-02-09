// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    ENDPOINTS: {
        // Auth
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        DASHBOARD: '/api/auth/dashboard',

        // Links
        CREATE_LINK: '/api/links/create',
        GET_ALL_LINKS: '/api/links/all',
        GET_ANALYTICS: (slug) => `/api/links/analytics/${slug}`,
        REDIRECT: (slug) => `/api/links/${slug}`,
    }
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};
