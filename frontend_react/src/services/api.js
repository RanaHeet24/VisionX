import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1/crypto';

export const cryptoApi = {
  getTopCoins: async (limit = 20) => {
    const response = await axios.get(`${API_BASE_URL}/top`, { params: { limit } });
    return response.data;
  },

  getLiveData: async (coinId) => {
    const response = await axios.get(`${API_BASE_URL}/live/${coinId}`);
    return response.data;
  },

  getPrediction: async (coinId) => {
    const response = await axios.get(`${API_BASE_URL}/predict/${coinId}`);
    return response.data;
  },

  getGlobalMetrics: async () => {
    const response = await axios.get(`${API_BASE_URL}/global`);
    return response.data;
  }
};
