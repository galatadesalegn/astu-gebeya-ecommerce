import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(() => {
        try {
            const saved = localStorage.getItem('adminInfo');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post(`/api/auth/login`, { email, password });

            if (data.role !== 'Admin') {
                throw new Error('Not authorized as an admin');
            }

            setAdmin(data);
            localStorage.setItem('adminInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('adminInfo');
    };

    return (
        <AdminContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AdminContext.Provider>
    );
};
