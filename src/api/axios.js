import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_API_URL_DEV;

console.log('API Base URL:', baseURL); // Debug log

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url); // Debug log
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status); // Debug log
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default instance;
