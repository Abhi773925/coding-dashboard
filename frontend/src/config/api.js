// API Configuration
const config = {
  // Backend server URL (for Socket.IO connections)
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://prepmate-kvol.onrender.com',
  
  // API base URL (for REST API calls)
  API_URL: import.meta.env.VITE_API_URL || 'https://prepmate-kvol.onrender.com',
  
  // Socket.IO URL (same as backend URL)
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'https://prepmate-kvol.onrender.com',
};

export default config;
