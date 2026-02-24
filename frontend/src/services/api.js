import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('ats_user');

  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (err) {
      console.error('Token parse error');
    }
  }

  return config;
});

export default api;   // ✅ VERY IMPORTANT