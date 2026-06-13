import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ===== Auth API =====
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ===== User API =====
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getHistory: () => api.get('/users/history'),
  getAllUsers: () => api.get('/users'),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// ===== Gemstone API =====
export const gemstoneAPI = {
  getAll: (params) => api.get('/gemstones', { params }),
  getById: (id) => api.get(`/gemstones/${id}`),
  create: (data) => api.post('/gemstones', data),
  update: (id, data) => api.put(`/gemstones/${id}`, data),
  delete: (id) => api.delete(`/gemstones/${id}`),
};

// ===== Recommendation API =====
export const recommendationAPI = {
  generate: (data) => api.post('/recommendations', data),
  save: (data) => api.post('/recommendations/save', data),
  getStats: () => api.get('/recommendations/stats'),
};

export default api;
