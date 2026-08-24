import axios from 'axios';

// إنشاء instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://hemma-production-fbbd.up.railway.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    } 
});

export default api;