import axios from 'axios';

// إنشاء instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://hemma-psi.vercel.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    } 
});

export default api;