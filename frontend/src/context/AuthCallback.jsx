
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        console.log("Received token:", token ? "Token exists" : "No token"); // Debugging

        if (!token) {
          setError('No authentication token provided');
          setLoading(false);
          return;
        }

        // Store token
        localStorage.setItem('auth_token', token);
        
        // Parse JWT
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("Token payload:", payload); // Debugging
            
            // Login with user data
            const loginSuccess = await login({
              id: payload.id,
              name: payload.name,
              email: payload.email,
              profilePicture: payload.profilePicture
            }, token);
            
            if (loginSuccess) {
              console.log("Login successful, navigating to dashboard"); // Debugging
              navigate('/dashboard');
            } else {
              setError('Failed to log in with the provided token');
            }
          } else {
            setError('Invalid token format');
          }
        } catch (parseError) {
          console.error("Token parsing error:", parseError);
          setError('Could not parse authentication token');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, login]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#090e1a]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-white">Processing authentication...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we log you in</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#090e1a] p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-md">
          <p className="font-bold">Authentication Error</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Error code: AUTH_CALLBACK_FAILURE</p>
        </div>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return null;
};

export default AuthCallback;