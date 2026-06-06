import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                return typeof parsed === 'object' ? parsed : null;
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const login = async (email, password) => {
        const { data } = await api.post(`/api/auth/login`, { email, password });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post(`/api/auth/register`, { name, email, password, role });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    };

    const verifyOTP = async (email, otp) => {
        const { data } = await api.post(`/api/auth/verify-otp`, { email, otp });
        // Update local user state
        if (user) {
            const updatedUser = { ...user, isVerified: true, emailVerified: true };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
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
        <AuthContext.Provider value={{ user, login, register, logout, verifyOTP, resendOTP }}>
            {children}
        </AuthContext.Provider>
    );
};
