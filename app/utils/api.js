import axios from 'axios';

// إنشاء instance
const api = axios.create({
    baseURL: '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    } 
});

export default api;