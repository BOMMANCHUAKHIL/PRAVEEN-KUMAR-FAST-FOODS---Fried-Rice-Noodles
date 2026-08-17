import axios from 'axios';

// Backend API URL
const API_URL =
  import.meta.env.VITE_API_BASE ||
  'https://praveen-kumar-fast-foods-fried-rice-noodles-production.up.railway.app';

console.log('📡 API URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    // Make sure accidental HTTP URLs are converted to HTTPS
    if (config.url && config.url.startsWith('http://')) {
      config.url = config.url.replace('http://', 'https://');
    }

    // Get either admin or customer token
    const adminToken = localStorage.getItem('adminToken');
    const customerToken = localStorage.getItem('customerToken');

    const token = adminToken || customerToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      '📤 Request:',
      config.method?.toUpperCase(),
      config.baseURL,
      config.url
    );

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    console.log(
      '📥 Response:',
      response.status,
      response.config.url
    );

    return response;
  },
  (error) => {
    console.error(
      '❌ Response Error:',
      error.response?.status,
      error.response?.data || error.message
    );

    // Optional: handle unauthorized requests
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized request');
    }

    return Promise.reject(error);
  }
);

export default api;