// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // First check local storage
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');
      
      if (storedUser && token) {
        // Verify the token is still valid
        const response = await fetch('https://zidio-kiun.onrender.com/api/auth/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({ token })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } else {
        // Try to get user from cookie-based auth
        const response = await fetch('https://zidio-kiun.onrender.com/api/auth/user', {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setError('Authentication check failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function - redirect to Google OAuth
  const login = () => {
    window.location.href = 'https://zidio-kiun.onrender.com/api/auth/google';
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint
      await fetch('https://zidio-kiun.onrender.com/api/auth/logout', {
        credentials: 'include'
      });
      
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      
      // Update state
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        isAuthenticated: !!user, 
        login, 
        logout,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;