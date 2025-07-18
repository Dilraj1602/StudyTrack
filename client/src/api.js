import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Add more API functions as needed
