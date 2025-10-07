import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } 
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// API functions
export const getStockReturns = async (ticker) => {
    try {
        const response = await api.get(`/api/stock-returns/?ticker=${ticker}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock returns:', error);
        throw error;
    }
};

export default api;