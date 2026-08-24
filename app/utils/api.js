import axios from 'axios';

// إنشاء instance
const api = axios.create({
    baseURL: '/api/backend',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    } 
});

api.interceptors.request.use((config) => {
    if (config.url?.startsWith('/api/auth/')) {
        config.baseURL = '';
    }
    return config;
});

export default api;