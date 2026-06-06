import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const parsed = JSON.parse(savedUser);
                    if (parsed && typeof parsed === 'object') {
                        setUser(parsed);
                    }
                } catch (e) {
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post(`/api/auth/login`, { email, password });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post(`/api/auth/register`, { name, email, password, role });
        // DO NOT setUser(data) or save to localStorage here
        // The user is not yet verified.
        return data;
    };

    const verifyOTP = async (email, otp) => {
        const { data } = await api.post(`/api/auth/verify-otp`, { email, otp });
        // After successful verification, we automatically log the user in
        // since the backend now returns the user data and tokens
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    };

    const resendOTP = async (email) => {
        const { data } = await api.post(`/api/auth/resend-verification`, { email });
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, verifyOTP, resendOTP }}>
            {children}
        </AuthContext.Provider>
    );
};
