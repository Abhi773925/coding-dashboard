// Create a new component/page: AuthCallback.jsx
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
      
      // Decode the token to get user info (you can use jwt-decode library or do it on the server)
      fetch('https://zidio-kiun.onrender.com/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        // Redirect to home page
        navigate('/');
      })
      .catch(err => {
        console.error('Error verifying token:', err);
        navigate('/');
      });
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  return <div>Logging you in...</div>;
};

export default AuthCallback;