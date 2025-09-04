import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      
      // Prepare headers with additional token if available
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add session token as header if available (fallback mechanism)
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        localStorage.setItem('token', sessionToken);
        console.log('Including session token in request');
        headers['X-Session-Token'] = sessionToken;
      }
      
      const response = await fetch(`${config.API_BASE_URL}/api/auth/current-user`, {
        method: 'GET',
        credentials: 'include',  // This is critical for sending cookies
        headers: headers,
        // Cache: 'no-store' ensures we don't get a cached response
        cache: 'no-store'
      });

      console.log('Auth response status:', response.status);
      console.log('Auth response headers:', response.headers);
      console.log('Document cookies:', document.cookie);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User authenticated:', userData.name);
        setUser(userData);
        // Store auth success in localStorage as a backup indicator
        localStorage.setItem('authSuccess', 'true');
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', userData.name);

      } else {
        console.log('User not authenticated, error code:', response.status);
        setUser(null);
        localStorage.removeItem('authSuccess');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem('authSuccess');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Store current URL to redirect back after login
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/' && !currentPath.includes('auth=success')) {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    // Clear any previous auth indicators
    localStorage.removeItem('authSuccess');
    
    console.log('Redirecting to Google OAuth...');
    window.location.href = `${config.API_BASE_URL}/api/auth/google`;
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      const response = await fetch(`${config.API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('Logout successful');
        // Clean up all auth state
        setUser(null);
        localStorage.removeItem('authSuccess');
        localStorage.removeItem('token');
        localStorage.removeItem('sessionToken');
        sessionStorage.removeItem('redirectAfterLogin');
        
        // Redirect to home page after logout
        window.location.href = '/';
      } else {
        console.error('Logout failed with status:', response.status);
        // Still clear local state even if server-side logout fails
        setUser(null);
        localStorage.removeItem('authSuccess');
        localStorage.removeItem('token');
        localStorage.removeItem('sessionToken');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout request fails, clear user state
      setUser(null);
      localStorage.removeItem('authSuccess');
    }
  };

  // Enhanced debug function to check authentication status
  const debugAuth = async () => {
    try {
      console.log('=== AUTH DEBUG START ===');
      console.log('LocalStorage authSuccess:', localStorage.getItem('authSuccess'));
      console.log('Current user state:', user ? `${user.name} (${user.email})` : 'Not logged in');
      console.log('Loading state:', loading);
      console.log('Document cookie:', document.cookie);
      
      // Check if cookies are enabled
      const cookiesEnabled = navigator.cookieEnabled;
      console.log('Cookies enabled in browser:', cookiesEnabled);
      
      // Make debug request to server
      console.log('Fetching auth debug data from server...');
      const response = await fetch(`${config.API_BASE_URL}/api/auth/debug`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Server auth debug data:', data);
      console.log('=== AUTH DEBUG END ===');
      
      return {
        clientState: {
          user,
          loading,
          authSuccess: localStorage.getItem('authSuccess'),
          cookiesEnabled,
          clientCookies: document.cookie,
        },
        serverState: data
      };
    } catch (error) {
      console.error('Debug auth failed:', error);
      return {
        clientState: {
          user,
          loading,
          authSuccess: localStorage.getItem('authSuccess'),
          cookiesEnabled: navigator.cookieEnabled,
          clientCookies: document.cookie,
          error: error.message
        },
        serverState: null
      };
    }
  };

  useEffect(() => {
    // Check for authentication success in URL
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth');
    const token = urlParams.get('token');
    const authError = urlParams.get('error');
    
    if (authSuccess === 'success') {
      console.log('Auth success detected in URL');
      
      // If token is present in URL, store it
      if (token) {
        console.log('Auth token detected in URL:', token);
        localStorage.setItem('sessionToken', token);
        localStorage.setItem('token', token);
      }
      
      // Clean up URL immediately
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // When auth=success is in the URL, we know the backend has set the session cookie
      // Mark auth success in localStorage (this is just an indicator, not the actual auth)
      localStorage.setItem('authSuccess', 'true');
      
      // Add a slight delay to ensure cookies are properly set
      setTimeout(() => {
        // Check authentication state after a small delay
        checkAuth().then(() => {
          // Check for redirect path after auth check
          const redirectPath = sessionStorage.getItem('redirectAfterLogin');
          if (redirectPath && redirectPath !== '/' && !redirectPath.includes('auth=success')) {
            console.log('Redirecting to stored path:', redirectPath);
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectPath;
            return;
          }
        });
      }, 500);
    } else if (authError) {
      console.error('Auth error detected:', authError);
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      localStorage.removeItem('authSuccess');
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('token');
      setLoading(false);
    } else {
      // Normal auth check on page load
      console.log('Normal auth check on page load');
      checkAuth();
    }
  }, []);

  // Add a periodic auth check to handle session expiration
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        checkAuth();
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle visibility change to check auth when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    debugAuth, // Add debug function to context
    isLoggedIn: !!user // Add isLoggedIn property based on user existence
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;