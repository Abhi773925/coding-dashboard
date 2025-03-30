import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, 
  Search, 
  AlertTriangle, 
  Code, 
  BookOpen 
} from 'lucide-react';

const NotFoundPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);

  // Animated Background Component
  const AnimatedBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className={`
              absolute rounded-full opacity-20 animate-ping
              ${isDarkMode 
                ? 'bg-indigo-900' 
                : 'bg-indigo-200'
              }
            `}
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Countdown Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        navigate('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, navigate]);

  return (
    <div 
      className={`
        relative min-h-screen flex items-center justify-center 
        px-4 py-16 transition-colors duration-300
        ${isDarkMode 
          ? 'bg-zinc-950 text-gray-100' 
          : 'bg-white text-gray-900'}
      `}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content Container */}
      <div 
        className={`
          relative z-10 max-w-2xl w-full 
          rounded-2xl shadow-2xl p-8 
          transform transition-all duration-300 hover:scale-105
          ${isDarkMode 
            ? 'bg-zinc-900 border border-zinc-800' 
            : 'bg-white border border-gray-100'}
        `}
      >
        {/* Error Icon and Message */}
        <div className="flex flex-col items-center space-y-6 text-center">
          <AlertTriangle 
            className={`
              text-6xl animate-bounce
              ${isDarkMode 
                ? 'text-indigo-400' 
                : 'text-indigo-600'}
            `} 
          />
          <h1 
            className={`
              text-4xl font-bold
              ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
            `}
          >
            404 - Page Not Found
          </h1>
          <p 
            className={`
              text-xl max-w-md
              ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}
            `}
          >
            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          </p>
        </div>

        {/* Auto Redirect Countdown */}
        <div 
          className={`
            mt-6 text-center
            ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}
          `}
        >
          Redirecting to home in {timeLeft} seconds
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-full
              transition duration-300 transform hover:scale-105
              ${isDarkMode
                ? 'bg-zinc-800/50 text-indigo-300 hover:bg-zinc-800'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'}
            `}
          >
            <Home />
            <span>Go to Home</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-full
              border transition duration-300 transform hover:scale-105
              ${isDarkMode
                ? 'bg-zinc-800/30 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                : 'bg-white text-indigo-600 border-indigo-600 hover:bg-gray-50'}
            `}
          >
            <Search />
            <span>Reload Page</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-10 text-center">
          <h3 
            className={`
              text-lg font-semibold mb-4
              ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}
            `}
          >
            Quick Navigation
          </h3>
          <div className="flex justify-center space-x-4">
            <Link
              to="/allcourse"
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full
                transition duration-300 transform hover:scale-105
                ${isDarkMode
                  ? 'bg-zinc-800/50 text-indigo-300 hover:bg-zinc-800'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}
              `}
            >
              <BookOpen size={18} />
              <span>Courses</span>
            </Link>
            <Link
              to="/projects"
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full
                transition duration-300 transform hover:scale-105
                ${isDarkMode
                  ? 'bg-zinc-800/50 text-emerald-300 hover:bg-zinc-800'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}
              `}
            >
              <Code size={18} />
              <span>Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;