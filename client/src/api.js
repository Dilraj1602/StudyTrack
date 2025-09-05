import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const getCurrentUser = () => API.get('/auth/current-user');

// New signup OTP verification functions
export const sendSignupOtp = (data) => API.post('/auth/send-signup-otp', data);
export const verifySignupOtp = (data) => API.post('/auth/verify-signup-otp', data);

// Password management
export const changePassword = (data) => API.post('/auth/change-password', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
export const verifyResetCode = (data) => API.post('/auth/verify-reset-code', data);

export const getTasks = () => API.get('/tasks');
export const getMonthlyStats = (year) => API.get(`/tasks/monthly-stats/${year}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export const chatWithBot = (data) => API.post('/chat', data);

// Tracking and AI insights
export const getTrackingInsights = () => API.get('/tracking/insights');
export const getStudyStats = () => API.get('/tracking/stats');
