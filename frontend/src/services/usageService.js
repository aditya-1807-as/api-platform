import api from './api';

export const usageService = {
  async getSummary() {
    const res = await api.get('/usage/summary');
    return res.data;
  },

  async getDailyUsage(days = 30) {
    const res = await api.get(`/usage/by-day?days=${days}`);
    return res.data;
  },

  async getEndpointUsage(days = 30) {
    const res = await api.get(`/usage/by-endpoint?days=${days}`);
    return res.data;
  },

  async getHistory(apiKeyId = null, page = 0, size = 20) {
    let url = `/usage/history?page=${page}&size=${size}`;
    if (apiKeyId) {
      url += `&apiKeyId=${apiKeyId}`;
    }
    const res = await api.get(url);
    return res.data;
  },
};
