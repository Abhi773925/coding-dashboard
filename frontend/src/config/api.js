// API Configuration
const config = {
  // Backend server URL (for Socket.IO connections)
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  
  // API base URL (for REST API calls)
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Socket.IO URL (same as backend URL)
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
};

export default config;
