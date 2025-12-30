// Centralized API Configuration
import axios from 'axios';

export const API_CONFIG = {
  // Base URL for all API calls
  BASE_URL: "https://www.programshouse.com/dashboards/dolphin/api",
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  
  // Authentication token keys (in order of priority)
  TOKEN_KEYS: ['access_token', 'admin_token', 'token'],
};

// Helper function to get authentication token
export const getAuthToken = () => {
  for (const key of API_CONFIG.TOKEN_KEYS) {
    const token = localStorage.getItem(key);
    if (token) return token;
  }
  return null;
};

// Helper function to get base URL for fetch calls
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers for fetch calls
export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to create axios instance with common configuration
export const createApiInstance = () => {
  const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS,
  });

  // Request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
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
        // Clear all token keys
        API_CONFIG.TOKEN_KEYS.forEach(key => localStorage.removeItem(key));
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default API_CONFIG;
