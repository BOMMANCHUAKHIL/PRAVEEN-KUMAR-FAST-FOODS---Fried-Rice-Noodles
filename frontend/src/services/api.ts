import axios from 'axios';

// ✅ Read from environment variable
const API_BASE = import.meta.env.VITE_API_BASE;

// ✅ If not set, use the hardcoded backend URL
const API_URL = API_BASE || 'https://ahaa-backend-production.up.railway.app';

console.log('🔍 API_BASE from env:', API_BASE);
console.log('🔍 API_URL used:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('customerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});