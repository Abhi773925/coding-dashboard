import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Redirect to your backend auth endpoint
      window.location.href = 'https://zidio-kiun.onrender.com/api/auth/google';
      // Note: The page will reload as it's redirecting to Google OAuth
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to initiate login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#090e1a] p-4">
      <div className="bg-[#131c31] p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Log In to Zudio</h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white text-gray-800 py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></span>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            By continuing, you agree to Zudio's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;