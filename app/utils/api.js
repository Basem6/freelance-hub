import axios from 'axios';

// إنشاء instance
const api = axios.create({
    baseURL: 'https://hemma-e.up.railway.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    } 
});

export default api;