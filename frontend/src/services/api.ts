import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('customerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});