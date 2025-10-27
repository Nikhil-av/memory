// api/client.ts
import axios from 'axios';
// 1. IMPORT the new library
import AsyncStorage from '@react-native-async-storage/async-storage';

// âš ï¸ IMPORTANT: Replace with your computer's IP address.
// You can find it by running `ipconfig` (Windows) or `ifconfig` (Mac/Linux).
const API_BASE_URL = 'https://flask-intelligent-files-backend-dark-moon-6731.fly.dev';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the JWT token to every request
apiClient.interceptors.request.use(
  async (config) => {
    // 2. USE the new library's method to get the token
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;