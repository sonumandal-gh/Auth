import axios from 'axios';

// Create centralized Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://auth-ad32.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Auto-attach Authorization: Bearer <token> to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 Unauthorized globally and handle session expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and auth info from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');

      // Dispatch global custom event so AuthContext can update state
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
