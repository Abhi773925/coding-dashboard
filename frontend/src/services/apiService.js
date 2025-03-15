// src/services/apiService.js
const API_BASE_URL = 'https://zidio-kiun.onrender.com/api';

/**
 * Helper to add auth token to requests
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Base fetch function with error handling
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Merge default options with provided options
    const fetchOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      credentials: 'include', // Important for cookies
    };
    
    const response = await fetch(url, fetchOptions);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Handle unsuccessful responses
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      
      return data;
    }
    
    // Handle non-JSON responses
    if (!response.ok) {
      throw new Error('An error occurred');
    }
    
    return await response.text();
    
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * API Service with methods for common operations
 */
const apiService = {
  // Auth related endpoints
  auth: {
    verifyToken: (token) => fetchWithAuth('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token })
    }),
    getUser: () => fetchWithAuth('/auth/user'),
    logout: () => fetchWithAuth('/auth/logout')
  },
  
  // Task related endpoints
  tasks: {
    getAll: () => fetchWithAuth('/Zidio/tasks'),
    getById: (id) => fetchWithAuth(`/Zidio/tasks/${id}`),
    create: (data) => fetchWithAuth('/Zidio/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => fetchWithAuth(`/Zidio/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => fetchWithAuth(`/Zidio/tasks/${id}`, {
      method: 'DELETE'
    })
  },
  
  // User related endpoints
  users: {
    getAll: () => fetchWithAuth('/Zidio/users'),
    getById: (id) => fetchWithAuth(`/Zidio/users/${id}`),
    update: (id, data) => fetchWithAuth(`/Zidio/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  
  // Notifications
  notifications: {
    getAll: () => fetchWithAuth('/Zidio/notifications'),
    markAsRead: (id) => fetchWithAuth(`/Zidio/notifications/${id}/read`, {
      method: 'PUT'
    })
  }
};

export default apiService;