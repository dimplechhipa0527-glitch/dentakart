import axios from 'axios';
import { Capacitor } from '@capacitor/core';

export const CLOUD_API_BASE_URL = 'https://dentakart-backend.onrender.com/api';

const getApiBaseUrl = () => {
  // Explicit override from Vite env
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }

  // Capacitor Native Android / iOS Mobile App (MUST use live cloud URL, never localhost)
  if (Capacitor.isNativePlatform() || (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.())) {
    return CLOUD_API_BASE_URL;
  }

  // Browser checks
  if (typeof window !== 'undefined' && window.location) {
    // If in Android WebView where scheme is https://localhost but not native flagged
    if (window.location.protocol === 'capacitor:' || (window.location.hostname === 'localhost' && window.location.port === '')) {
      return CLOUD_API_BASE_URL;
    }

    // If local dev server with port 5173 (desktop browser)
    if (window.location.port === '5173') {
      return '/api';
    }

    // If on live Render website (web browser)
    if (window.location.hostname.includes('onrender.com')) {
      return '/api';
    }
  }

  return CLOUD_API_BASE_URL;
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
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
      localStorage.removeItem('dentakart_token');
    }
    return Promise.reject(error);
  }
);

export default api;
