// src/services/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE, timeout: 8000 });

export const getLatestData    = () => api.get('/data').then(r => r.data);
export const postSensorData   = (payload) => api.post('/data', payload).then(r => r.data);
export const getHistory       = (params = {}) => api.get('/history', { params }).then(r => r.data);
export const getStats         = (params = {}) => api.get('/stats', { params }).then(r => r.data);

export default api;
