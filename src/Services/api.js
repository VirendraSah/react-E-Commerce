import axios from 'axios';


const api = axios.create({
    baseURL: 'https://5s0267df-4000.inc1.devtunnels.ms',
    // timeout: 10000,
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
