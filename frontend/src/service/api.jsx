import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');

    if (!refresh_token) {
        throw new Error('No refresh token available');
    }

    try {
        // Use a separate axios instance to avoid interceptors loop
        const response = await axios.post(`${BASE_URL}auth/refresh/`, {
            refresh: refresh_token
        }, {
            withCredentials: true
        });

        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);

            if (response.data.refresh) {
                localStorage.setItem('refresh_token', response.data.refresh);
            }

            return response.data.access;
        }

        throw new Error('No access token received');
    } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw error;
    }
};

// Response interceptor
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log(error.response)
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Clear tokens and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                toast.error('Session expired. Please log in again.');
                console.log(error)

                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
