import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-actual-backend-url.com/api'; // Update with your actual backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const authAPI = {
  signUp: (userData) => api.post('/auth/signup', userData),
  verifyOTP: (otpData) => api.post('/auth/verifyotp', otpData),
  signIn: (credentials) => api.post('/auth/signin', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgotpassword', email),
  resetPassword: (resetData) => api.post('/auth/resetpassword', resetData)
};

// Notes API endpoints
export const notesAPI = {
  getAllNotes: () => api.get('/notes/'),
  getNote: (id) => api.get(`/notes/${id}`),
  createNote: (noteData) => api.post('/notes/', noteData),
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  searchNotes: (query) => api.get(`/notes/search?query=${encodeURIComponent(query)}`),
  getNotesByTag: (tag) => api.get(`/notes/tags/${encodeURIComponent(tag)}`),
  
  // AI-powered features
  generateTitle: (noteId) => api.post(`/notes/gen-title/${noteId}`),
  generateContent: (topic) => api.post('/notes/gen-content', { topic }),
  improveContent: (content) => api.post('/notes/improve-content', { content })
};

// Chat API endpoints
export const chatAPI = {
  chatWithNote: (noteId, messageData) => api.post(`/notes/${noteId}/chat`, messageData),
  getConversationHistory: (noteId, sessionId = null) => {
    const url = sessionId 
      ? `/notes/${noteId}/conversations?sessionId=${sessionId}`
      : `/notes/${noteId}/conversations`;
    return api.get(url);
  },
  clearConversation: (sessionId) => api.put(`/notes/conversations/${sessionId}/clear`),
  deleteConversation: (sessionId) => api.delete(`/notes/conversations/${sessionId}`)
};

export default api;