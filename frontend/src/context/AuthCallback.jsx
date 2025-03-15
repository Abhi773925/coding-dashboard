// src/components/AuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL if present
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (token) {
        // Store token in localStorage
        localStorage.setItem('auth_token', token);
        
        // Parse JWT payload to get user info
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            localStorage.setItem('user', JSON.stringify(payload));
          }
        } catch (err) {
          console.error('Token parsing error:', err);
        }
      }
      
      // Refresh auth state
      await checkAuthStatus();
      
      // Redirect to home or intended destination
      navigate('/');
    };
    
    handleCallback();
  }, [checkAuthStatus, navigate, location]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;