import axios from 'axios';

const getApiBaseUrl = () => {
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    // In local development on desktop browser, use Vite proxy /api
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '/api';
    }
    // In production web deployment (Netlify/Vercel) and native Capacitor mobile app
    return 'https://dentakart-backend.onrender.com/api';
  }
  return 'https://dentakart-backend.onrender.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dentakart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired
      localStorage.removeItem('dentakart_token');
    }
    return Promise.reject(error);
  }
);

export default api;
