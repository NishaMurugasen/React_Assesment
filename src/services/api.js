import axios from 'axios';

const API_KEY = 'reqres_70f9782441694acebc1e75883738de21'; 

const api = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
    // This is where you use the key
    'x-api-key': API_KEY, 
    'Content-Type': 'application/json',
  },
});

// This interceptor handles the user token after they log in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
};

export const usersAPI = {
  fetchUsers: (page = 1) => api.get(`/users?page=${page}&per_page=12`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;