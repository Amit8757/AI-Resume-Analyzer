import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getStoredUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await loginService(credentials);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const data = await registerService(userData);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: isAuthenticated(),
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
