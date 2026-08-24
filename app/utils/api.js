import axios from 'axios';

// إنشاء instance
const api = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    } 
});

export default api;