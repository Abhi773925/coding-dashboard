import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronDown, 
  CheckSquare, 
  Square, 
  Sliders 
} from 'lucide-react';

const FilterForm = ({ filter, setFilter, onClose }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const difficultyColors = {
    All: 'bg-gray-500',
    Easy: 'bg-green-500',
    Medium: 'bg-yellow-500',
    Hard: 'bg-red-500'
  };

  const statusColors = {
    All: 'bg-gray-500',
    Completed: 'bg-green-500',
    Pending: 'bg-orange-500'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        bg-black bg-opacity-30 backdrop-blur-sm 
        p-4 md:p-0
      `}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`
          relative w-full max-w-md 
          ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}
          rounded-2xl shadow-2xl border border-opacity-10
          overflow-hidden
        `}
      >
        {/* Header */}
        <div 
          className={`
            flex items-center justify-between p-4 
            ${theme === 'dark' 
              ? 'bg-gray-700 border-b border-gray-600' 
              : 'bg-gray-100 border-b border-gray-200'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-6 h-6" />
            <h3 className="text-xl font-bold">Filter Options</h3>
          </div>
          <motion.button 
            whileHover={{ rotate: 180 }}
            onClick={onClose}
            className="text-red-500 hover:bg-red-50 p-2 rounded-full"
          >
            ×
          </motion.button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          {/* Difficulty Dropdown */}
          <div>
            <label className="flex items-center mb-2 font-semibold">
              <Sliders className="mr-2 w-5 h-5" />
              Difficulty
            </label>
            <div className="relative">
              <select
                name="difficulty"
                value={filter.difficulty}
                onChange={handleChange}
                className={`
                  w-full p-3 rounded-lg appearance-none
                  ${theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-100 text-black border-gray-300'
                  }
                  transition-all duration-300 
                  focus:ring-2 focus:ring-blue-500
                `}
              >
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <option 
                    key={diff} 
                    value={diff} 
                    className="flex items-center"
                  >
                    {diff}
                  </option>
                ))}
              </select>
              <ChevronDown 
                className="absolute right-3 top-1/2 -translate-y-1/2 
                text-gray-500 pointer-events-none"
              />
              <div 
                className={`
                  absolute left-2 top-1/2 -translate-y-1/2 
                  w-4 h-4 rounded-full 
                  ${difficultyColors[filter.difficulty]}
                `}
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="flex items-center mb-2 font-semibold">
              <Sliders className="mr-2 w-5 h-5" />
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={filter.status}
                onChange={handleChange}
                className={`
                  w-full p-3 rounded-lg appearance-none
                  ${theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-100 text-black border-gray-300'
                  }
                  transition-all duration-300 
                  focus:ring-2 focus:ring-blue-500
                `}
              >
                {['All', 'Completed', 'Pending'].map((status) => (
                  <option 
                    key={status} 
                    value={status} 
                    className="flex items-center"
                  >
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown 
                className="absolute right-3 top-1/2 -translate-y-1/2 
                text-gray-500 pointer-events-none"
              />
              <div 
                className={`
                  absolute left-2 top-1/2 -translate-y-1/2 
                  w-4 h-4 rounded-full 
                  ${statusColors[filter.status]}
                `}
              />
            </div>
          </div>

          {/* Revision Checkbox */}
          <div 
            className="flex items-center space-x-3 
            cursor-pointer hover:bg-gray-100 p-2 rounded-lg 
            transition-colors duration-300"
          >
            <motion.div 
              whileTap={{ scale: 0.9 }}
              onClick={() => setFilter(prev => ({
                ...prev, 
                revision: !prev.revision
              }))}
            >
              {filter.revision ? (
                <CheckSquare className="text-blue-500 w-6 h-6" />
              ) : (
                <Square className="text-gray-400 w-6 h-6" />
              )}
            </motion.div>
            <label className="select-none">Revision Only</label>
          </div>

          {/* Apply Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`
              w-full p-3 rounded-lg 
              flex items-center justify-center 
              font-bold uppercase tracking-wide
              transition-all duration-300
              ${theme === 'dark'
                ? 'bg-blue-700 text-white hover:bg-blue-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }
              shadow-lg hover:shadow-xl
            `}
          >
            Apply Filters
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterForm;