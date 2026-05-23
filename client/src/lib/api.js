import axios from 'axios';
import { getToken, clearToken } from './auth';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap response data and surface server error messages on failure
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    const message = err.response?.data?.error ?? err.message;
    return Promise.reject(new Error(message));
  }
);

// Tournaments
export const getTournament = (id) => api.get(`/tournaments/${id}`);
export const getTournamentCategories = (id) => api.get(`/tournaments/${id}/categories`);
export const getTournamentCategoryTree = (id) => api.get(`/tournaments/${id}/categoryTree`);
export const getTournamentQuestionCounts = (id) => api.get(`/tournaments/${id}/questionCounts`);

// Questions
export const getQuestion = (id) => api.get(`/questions/${id}`);
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const createQuestion = (data) => api.post('/questions/', data);

// Auth
export const loginUser = (username, password) => api.post('/auth/login', { username, password });
