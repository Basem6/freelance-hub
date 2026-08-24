import axios from 'axios';

// إنشاء instance
const api = axios.create({
    baseURL: REACT_APP_API_URL || 'https://hemma-production-fbbd.up.railway.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    } 
});

export default api;