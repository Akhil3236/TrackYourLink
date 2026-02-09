import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        if (authService.isAuthenticated()) {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData.user);
            } catch (error) {
                console.error('Auth check failed:', error);
                authService.logout();
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        setUser(response.user);
        return response;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        setUser(response.user);
        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
