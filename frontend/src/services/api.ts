import axios from 'axios';

// ✅ Explicitly use HTTPS
const API_URL = 'https://praveen-kumar-fast-foods-fried-rice-noodles-production.up.railway.app/';

console.log('📡 API URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  // ✅ Force HTTPS
  httpsAgent: new (require('https').Agent)({
    rejectUnauthorized: false,
  }),
});

api.interceptors.request.use(
  (config) => {
    // ✅ Ensure URL uses HTTPS
    if (config.url && config.url.startsWith('http://')) {
      config.url = config.url.replace('http://', 'https://');
    }

    const token = localStorage.getItem('adminToken') || localStorage.getItem('customerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;