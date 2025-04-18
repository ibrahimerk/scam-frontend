import axios from 'axios';
import { Report } from '@/types';

const API_URL = 'http://127.0.0.1:8000/api';

// Axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Request Headers:', config.headers); // Debug log
  } else {
    console.warn('No token found in localStorage');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);

      // If token is expired, try to refresh it
      if (error.response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_URL}/token/refresh/`, {
              refresh: refreshToken
            });
            localStorage.setItem('token', response.data.access);
            
            // Retry the original request with new token
            const config = error.config;
            config.headers.Authorization = `Bearer ${response.data.access}`;
            return axios(config);
          } catch (refreshError) {
            // If refresh token is also expired, logout user
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        }
      }
      
      throw new Error(error.response.data.detail || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      throw new Error('Request configuration error');
    }
  }
);

// API endpoints
export const api = {
  auth: {
    login: async (username: string, password: string) => {
      try {
        const response = await axios.post(`${API_URL}/token/`, {
          username,
          password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    register: async (userData: {
      username: string;
      email: string;
      password: string;
      password2: string;
      first_name?: string;
      last_name?: string;
    }) => {
      try {
        console.log('Sending registration data:', userData); // Debug log
        const response = await axios.post(`${API_URL}/register/`, userData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        console.log('Registration response:', response.data); // Debug log
        return response.data;
      } catch (error) {
        console.error('Register error:', error);
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    },

    getCurrentUser: async () => {
      try {
        const response = await axiosInstance.get(`${API_URL}/user/`);
        return response.data;
      } catch (error) {
        console.error('Get current user error:', error);
        throw error;
      }
    },
  },

  // Reports API
  getReports: async (): Promise<Report[]> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/reports/`);
      return response.data;
    } catch (error) {
      console.error('Get reports error:', error);
      throw error;
    }
  },

  getReport: async (id: number): Promise<Report> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/reports/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get report error:', error);
      throw error;
    }
  },

  createReport: async (reportData: Omit<Report, 'id' | 'date_reported' | 'user'>): Promise<Report> => {
    try {
      console.log('Sending report data:', reportData); // Debug log
      const response = await axiosInstance.post(`${API_URL}/reports/`, reportData);
      return response.data;
    } catch (error) {
      console.error('Create report error:', error);
      throw error;
    }
  },

  updateReport: async (id: number, reportData: Partial<Report>): Promise<Report> => {
    try {
      const response = await axiosInstance.put(`${API_URL}/reports/${id}/`, reportData);
      return response.data;
    } catch (error) {
      console.error('Update report error:', error);
      throw error;
    }
  },

  deleteReport: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`${API_URL}/reports/${id}/`);
    } catch (error) {
      console.error('Delete report error:', error);
      throw error;
    }
  },
}; 