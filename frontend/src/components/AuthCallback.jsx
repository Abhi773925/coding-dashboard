// src/components/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      // Parse the token to get user info
      // JWT tokens are base64 encoded in three parts: header.payload.signature
      try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        localStorage.setItem('user', JSON.stringify(decodedPayload));
        
        // Update application state if needed
        console.log('User logged in successfully');
      } catch (err) {
        console.error('Error parsing token:', err);
      }
      
      // Redirect to home page
      navigate('/');
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  return <div>Logging you in...</div>;
};

export default AuthCallback;