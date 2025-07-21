import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import prepmateLogo from '../../assets/prepmate-logo.png';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm ${
      isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'
    } border-b ${
      isDarkMode ? 'border-slate-800' : 'border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <img 
                src={prepmateLogo} 
                alt="Prepmate Logo" 
                className="h-8 w-auto sm:h-10"
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
