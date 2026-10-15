import axios from 'axios';

export const modelService = {
  async getModels() {
    const res = await axios.get('/api/v1/models');
    return res.data?.data || [];
  },

  async sendChatCompletion(rawApiKey, model, messages, temperature = 0.7, maxTokens = 1024) {
    const start = performance.now();
    try {
      const response = await axios.post(
        '/api/v1/chat/completions',
        {
          model,
          messages,
          temperature,
          maxTokens,
        },
        {
          headers: {
            'X-API-Key': rawApiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      const duration = Math.round(performance.now() - start);
      return {
        success: true,
        data: response.data,
        duration,
      };
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      return {
        success: false,
        status: err.response?.status || 500,
        error: err.response?.data?.message || err.message || 'Failed to complete chat',
        duration,
      };
    }
  },
};
