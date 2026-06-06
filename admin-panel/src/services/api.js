import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'https://astu-gebeya-backend.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the admin token
api.interceptors.request.use(
    (config) => {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        if (adminInfo && adminInfo.token) {
            config.headers.Authorization = `Bearer ${adminInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
