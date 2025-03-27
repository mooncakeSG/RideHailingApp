import axios from 'axios';
import { store } from '../store/store';
import { RootState } from '../store/store';

const BASE_URL = 'https://your-api-base-url.com'; // Replace with your actual API base URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState() as RootState;
    const token = state.user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      store.dispatch({ type: 'user/clearUser' });
    }
    return Promise.reject(error);
  }
);

export default api; 