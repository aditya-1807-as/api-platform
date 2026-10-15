import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const publicPaths = ['/login', '/register', '/'];
    const isPublic = publicPaths.some(path => window.location.pathname === path || (path !== '/' && window.location.pathname.startsWith(path)));
    if (error.response && error.response.status === 401 && !isPublic) {
      // Clear expired session and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default api;
