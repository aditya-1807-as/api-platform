import api from './api';

export const keyService = {
  async listKeys() {
    const res = await api.get('/keys');
    return res.data;
  },

  async getKey(id) {
    const res = await api.get(`/keys/${id}`);
    return res.data;
  },

  async createKey(payload) {
    const res = await api.post('/keys', payload);
    return res.data;
  },

  async updateKey(id, payload) {
    const res = await api.patch(`/keys/${id}`, payload);
    return res.data;
  },

  async revokeKey(id) {
    const res = await api.delete(`/keys/${id}`);
    return res.data;
  },
};
