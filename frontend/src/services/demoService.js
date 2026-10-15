import axios from 'axios';

export const demoService = {
  async callProfile(rawApiKey) {
    const start = performance.now();
    try {
      const response = await axios.get('/api/v1/demo/profile', {
        headers: { 'X-API-Key': rawApiKey },
      });
      const duration = Math.round(performance.now() - start);
      return { success: true, status: response.status, data: response.data, duration };
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      return {
        success: false,
        status: err.response ? err.response.status : 500,
        data: err.response ? err.response.data : { message: err.message },
        duration,
      };
    }
  },

  async callData(rawApiKey) {
    const start = performance.now();
    try {
      const response = await axios.get('/api/v1/demo/data', {
        headers: { 'X-API-Key': rawApiKey },
      });
      const duration = Math.round(performance.now() - start);
      return { success: true, status: response.status, data: response.data, duration };
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      return {
        success: false,
        status: err.response ? err.response.status : 500,
        data: err.response ? err.response.data : { message: err.message },
        duration,
      };
    }
  },

  async callEcho(rawApiKey, payload) {
    const start = performance.now();
    try {
      const response = await axios.post('/api/v1/demo/echo', payload, {
        headers: {
          'X-API-Key': rawApiKey,
          'Content-Type': 'application/json',
        },
      });
      const duration = Math.round(performance.now() - start);
      return { success: true, status: response.status, data: response.data, duration };
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      return {
        success: false,
        status: err.response ? err.response.status : 500,
        data: err.response ? err.response.data : { message: err.message },
        duration,
      };
    }
  },
};
