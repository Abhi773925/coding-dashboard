import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        console.log("Checking existing auth token:", token ? "Found token" : "No token"); // Debugging
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            
            // Check token expiration
            const currentTime = Date.now() / 1000;
            if (payload.exp && payload.exp < currentTime) {
              console.log("Token expired"); // Debugging
              localStorage.removeItem('auth_token');
              setLoading(false);
              return;
            }
            
            console.log("Valid token found, setting user"); // Debugging
            setUser({
              id: payload.id,
              name: payload.name,
              email: payload.email,
              profilePicture: payload.profilePicture
            });
            setIsAuthenticated(true);
          } else {
            console.log("Invalid token format"); // Debugging
            localStorage.removeItem('auth_token');
          }
        } catch (parseError) {
          console.error("Token parsing error:", parseError);
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('auth_token');
        setAuthError("Authentication verification failed");
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (userData, token) => {
    try {
      console.log("Login called with user data:", userData); // Debugging
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthError("Login failed");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    console.log("Logging out"); // Debugging
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
  };

  // Get auth token for API calls
  const getAuthToken = () => {
    return localStorage.getItem('auth_token');
  };

  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    authError,
    login,
    logout,
    getAuthToken
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