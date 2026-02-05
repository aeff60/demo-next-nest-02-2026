import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  // Login with email/password
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Login with LDAP
  loginLdap: async (username: string, password: string) => {
    const response = await api.post('/auth/login/ldap', { username, password });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Admin only endpoint
  getAdmin: async () => {
    const response = await api.get('/auth/admin');
    return response.data;
  },

  // Management endpoint
  getManagement: async () => {
    const response = await api.get('/auth/management');
    return response.data;
  },
};

// User APIs
export const userAPI = {
  // Register new user
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/user/register', { name, email, password });
    return response.data;
  },
};

// File APIs
export const fileAPI = {
  // Upload single file
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple files
  uploadMultiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await api.post('/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/files/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download file
  download: (filename: string) => {
    return `${api.defaults.baseURL}/files/download/${filename}`;
  },

  // View file (for images)
  view: (filename: string) => {
    return `${api.defaults.baseURL}/files/view/${filename}`;
  },

  // Delete file
  delete: async (filename: string) => {
    const response = await api.delete(`/files/${filename}`);
    return response.data;
  },
};

// Report APIs
export const reportAPI = {
  // Get report summary
  getSummary: async () => {
    const response = await api.get('/reports/summary');
    return response.data;
  },

  // Download PDF report
  downloadPdf: async () => {
    const response = await api.get('/reports/users/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Download Excel report
  downloadExcel: async () => {
    const response = await api.get('/reports/users/excel', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get PDF URL (for direct download)
  getPdfUrl: () => `${api.defaults.baseURL}/reports/users/pdf`,

  // Get Excel URL (for direct download)
  getExcelUrl: () => `${api.defaults.baseURL}/reports/users/excel`,
};

export default api;