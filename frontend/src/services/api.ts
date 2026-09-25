import axios from 'axios';

const getApiBaseUrl = () => {
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    // In web browsers (both localhost and remote/phone LAN IP like 10.50.3.132),
    // relative /api works seamlessly with Vite's proxy and production deployments
    if (window.location.protocol.startsWith('http')) {
      return '/api';
    }
    // In native Capacitor mobile apps, connect to backend host
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
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
