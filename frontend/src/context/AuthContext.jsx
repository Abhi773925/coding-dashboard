import React, { createContext, useContext, useState, useEffect } from 'react';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Validate token and get user info
        // You can make an API call here to validate the token on your server
        // For now, we'll just parse the JWT
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (payload.exp && payload.exp < currentTime) {
            // Token expired, clear it
            localStorage.removeItem('auth_token');
            setLoading(false);
            return;
          }
          
          // Token valid, set user
          setUser({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            profilePicture: payload.profilePicture
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('auth_token');
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (userData, token) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
  };

  // Auth context value
  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;