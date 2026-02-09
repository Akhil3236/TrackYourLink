// Helper to ensure URLs are HTTPS for production
export const ensureHttps = (url) => {
    if (!url) return url;
    const isProduction = typeof window !== 'undefined' &&
        (window.location.hostname === 'trackur.online' || window.location.hostname === 'www.trackur.online');

    if (isProduction && url.startsWith('http://')) {
        return url.replace('http://', 'https://');
    }
    return url;
};

// API Configuration
export const API_CONFIG = {
    BASE_URL: ensureHttps(import.meta.env.VITE_API_BASE_URL) || 'http://localhost:3000',
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
