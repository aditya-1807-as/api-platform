import api from './api';

export const adminService = {
  async getUsers(page = 0, size = 20) {
    const res = await api.get(`/admin/users?page=${page}&size=${size}`);
    return res.data;
  },

  async getKeys(page = 0, size = 20) {
    const res = await api.get(`/admin/keys?page=${page}&size=${size}`);
    return res.data;
  },

  async getGlobalSummary() {
    const res = await api.get('/admin/usage/summary');
    return res.data;
  },

  async getGlobalDaily(days = 30) {
    const res = await api.get(`/admin/usage/by-day?days=${days}`);
    return res.data;
  },

  async getGlobalEndpoint(days = 30) {
    const res = await api.get(`/admin/usage/by-endpoint?days=${days}`);
    return res.data;
  },

  async getGlobalHistory(page = 0, size = 20) {
    const res = await api.get(`/admin/usage/history?page=${page}&size=${size}`);
    return res.data;
  },
};
