import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Streak = () => {
  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios base URL for backend
  axios.defaults.baseURL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          throw new Error('No user email found');
        }

        const response = await axios.get('/streak', {
          params: { email: userEmail }
        });

        setStreak(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  const handleUpdateStreak = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('No user email found');
      }

      const response = await axios.post('/streak/update', { 
        email: userEmail 
      });

      setStreak(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-100 rounded-lg animate-pulse">
      Loading streak...
    </div>
  );

  if (error) return (
    <div className="w-full max-w-md mx-auto p-4 bg-red-100 text-red-800 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Coding Streak</h2>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Current Streak</p>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-2xl font-bold text-gray-800">{streak.currentStreak} days</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Longest Streak</p>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-2xl font-bold text-gray-800">{streak.longestStreak} days</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleUpdateStreak}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Log Today's Coding
        </button>
      </div>
    </div>
  );
};

export default Streak;