import React from 'react';
import { Linkedin, Instagram, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer 
      className={`
        ${isDarkMode 
          ? 'bg-zinc-950 text-gray-100' 
          : 'bg-white text-gray-900'}
        py-6 transition-colors duration-300
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Navigation Links */}
          <nav className="mb-4 space-x-4">
            {['FAQ', 'Support', 'Privacy', 'Timeline', 'Terms'].map((link) => (
              <a 
                key={link} 
                href="#" 
                className={`
                  ${isDarkMode 
                    ? 'text-zinc-300 hover:text-indigo-400' 
                    : 'text-gray-600 hover:text-indigo-600'}
                  transition duration-300
                `}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex space-x-4 mb-4">
            <a 
              href="#" 
              className={`
                flex items-center
                ${isDarkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'}
                transition duration-300
              `}
            >
              <Linkedin size={24} className="mr-2" />
              <span 
                className={`
                  ${isDarkMode 
                    ? 'text-zinc-300 hover:text-blue-300' 
                    : 'text-gray-700 hover:text-blue-700'}
                `}
              >
                LinkedIn
              </span>
            </a>
            <a 
              href="#" 
              className={`
                flex items-center
                ${isDarkMode 
                  ? 'text-gray-200 hover:text-white' 
                  : 'text-gray-800 hover:text-black'}
                transition duration-300
              `}
            >
              <X size={24} className="mr-2" />
              <span 
                className={`
                  ${isDarkMode 
                    ? 'text-zinc-300 hover:text-white' 
                    : 'text-gray-700 hover:text-black'}
                `}
              >
                X
              </span>
            </a>
            <a 
              href="#" 
              className={`
                flex items-center
                ${isDarkMode 
                  ? 'text-pink-400 hover:text-pink-300' 
                  : 'text-pink-600 hover:text-pink-700'}
                transition duration-300
              `}
            >
              <Instagram size={24} className="mr-2" />
              <span 
                className={`
                  ${isDarkMode 
                    ? 'text-zinc-300 hover:text-pink-300' 
                    : 'text-gray-700 hover:text-pink-700'}
                `}
              >
                Instagram
              </span>
            </a>
          </div>

          {/* Copyright with Gradient Text */}
          <div className="text-center">
            <p 
              className={`
                text-sm font-medium mb-1
                ${isDarkMode 
                  ? 'text-indigo-400 hover:text-indigo-300' 
                  : 'text-indigo-600 hover:text-indigo-700'}
                transition duration-300
              `}
            >
              © 2024 CodingKaro, Inc. All rights reserved.
            </p>
          
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;