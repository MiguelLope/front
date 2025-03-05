// api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://back-production-3ec7.up.railway.app',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Interceptor para CSRF
api.interceptors.request.use(async (config) => {
    if (['post', 'put', 'delete'].includes(config.method?.toLowerCase() || '')) {
        await axios.get(
            `${config.baseURL}/sanctum/csrf-cookie`,
            { withCredentials: true }
        );
    }
    return config;
});

export default api;