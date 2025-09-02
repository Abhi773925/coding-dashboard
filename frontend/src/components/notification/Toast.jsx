import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, X, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Toast = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto hide after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleExplore = () => {
    navigate('/learning/javascript');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 right-5 z-[9999]"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl overflow-hidden max-w-sm w-full border border-blue-500/20 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <FileCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300">
                        New Feature Added! 🎉
                      </h3>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        <p>JavaScript Practice Set is now available with:</p>
                        <div className="flex items-center mt-2 text-blue-600 dark:text-blue-400">
                          <Terminal className="h-4 w-4 mr-1" />
                          <span>Embedded Terminal</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleExplore}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-slate-300 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Explore Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
