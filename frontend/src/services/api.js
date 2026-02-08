import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = `${BASE_URL.replace(/\/$/, '')}/api`;

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Transaction API
export const transactionAPI = {
    create: (data) => api.post('/transactions', data),
    getAll: () => api.get('/transactions'),
    filter: (params) => api.get('/transactions/filter', { params }),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
    getCategories: () => api.get('/transactions/categories'),
};

// Account API
export const accountAPI = {
    create: (data) => api.post('/accounts', data),
    getAll: () => api.get('/accounts'),
    getOne: (id) => api.get(`/accounts/${id}`),
    update: (id, data) => api.put(`/accounts/${id}`, data),
    delete: (id) => api.delete(`/accounts/${id}`),
    transfer: (data) => api.post('/accounts/transfer', data),
    getTransfers: () => api.get('/accounts/transfers'),
};

// Dashboard API
export const dashboardAPI = {
    getSummary: () => api.get('/dashboard/summary'),
    getMonthly: (year) => api.get('/dashboard/monthly', { params: { year } }),
    getWeekly: (weeks) => api.get('/dashboard/weekly', { params: { weeks } }),
    getYearly: (years) => api.get('/dashboard/yearly', { params: { years } }),
    getCategories: (params) => api.get('/dashboard/categories', { params }),
    getDivisions: () => api.get('/dashboard/divisions'),
    getRecent: (limit) => api.get('/dashboard/recent', { params: { limit } }),
};

export default api;
