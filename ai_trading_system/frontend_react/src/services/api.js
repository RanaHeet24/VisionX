import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1/crypto';

// Shared axios instance with timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const cryptoApi = {
  getTopCoins: async (limit = 20) => {
    const response = await api.get('/top', { params: { limit } });
    return response.data;
  },

  getLiveData: async (coinId) => {
    const response = await api.get(`/live/${coinId}`);
    return response.data;
  },

  getPrediction: async (coinId) => {
    const response = await api.get(`/predict/${coinId}`);
    return response.data;
  },

  getGlobalMetrics: async () => {
    const response = await api.get('/global');
    return response.data;
  },

  warmupModel: async (coinId) => {
    const response = await api.post(`/warmup/${coinId}`);
    return response.data;
  }
};
