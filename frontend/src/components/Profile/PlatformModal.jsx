import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const PlatformModal = ({ isOpen, onClose, platform, onSubmit, existingUsername }) => {
  const [username, setUsername] = useState(existingUsername || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUsername(existingUsername || '');
      setValidationResult(null);
      setError('');
    }
  }, [isOpen, existingUsername]);

  const platformDetails = {
    leetcode: {
      name: 'LeetCode',
      placeholder: 'Enter your LeetCode username',
      exampleUrl: 'https://leetcode.com/username',
      description: 'Connect your LeetCode profile to track algorithm problems and contest performance',
      color: 'orange'
    },
    github: {
      name: 'GitHub',
      placeholder: 'Enter your GitHub username',
      exampleUrl: 'https://github.com/username',
      description: 'Connect your GitHub profile to track repositories, contributions, and code activity',
      color: 'gray'
    },
    geeksforgeeks: {
      name: 'GeeksforGeeks',
      placeholder: 'Enter your GeeksforGeeks username',
      exampleUrl: 'https://auth.geeksforgeeks.org/user/username',
      description: 'Connect your GeeksforGeeks profile to track coding practice and achievements',
      color: 'green'
    },
    codechef: {
      name: 'CodeChef',
      placeholder: 'Enter your CodeChef username',
      exampleUrl: 'https://codechef.com/users/username',
      description: 'Connect your CodeChef profile to track competitive programming performance',
      color: 'yellow'
    },
    codeforces: {
      name: 'Codeforces',
      placeholder: 'Enter your Codeforces handle',
      exampleUrl: 'https://codeforces.com/profile/username',
      description: 'Connect your Codeforces profile to track contest ratings and problem solving',
      color: 'blue'
    },
    hackerrank: {
      name: 'HackerRank',
      placeholder: 'Enter your HackerRank username',
      exampleUrl: 'https://hackerrank.com/username',
      description: 'Connect your HackerRank profile to track skills assessments and challenges',
      color: 'teal'
    }
  };

  const currentPlatform = platformDetails[platform] || {};

  const validateUsername = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setIsValidating(true);
    setError('');
    setValidationResult(null);

    try {
      const response = await fetch('/api/profile/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [platform]: username.trim()
        }),
      });

      const data = await response.json();
      
      if (data[platform]) {
        setValidationResult('valid');
      } else {
        setValidationResult('invalid');
        setError(`Username "${username}" not found on ${currentPlatform.name}`);
      }
    } catch (error) {
      setError('Failed to validate username. Please try again.');
      setValidationResult('error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validationResult !== 'valid') {
      await validateUsername();
      return;
    }

    onSubmit({ [platform]: username.trim() });
  };

  const getColorClasses = (color) => {
    const colors = {
      orange: 'border-orange-500 bg-orange-50 text-orange-700',
      gray: 'border-gray-500 bg-gray-50 text-gray-700',
      green: 'border-green-500 bg-green-50 text-green-700',
      yellow: 'border-yellow-500 bg-yellow-50 text-yellow-700',
      blue: 'border-blue-500 bg-blue-50 text-blue-700',
      teal: 'border-teal-500 bg-teal-50 text-teal-700'
    };
    return colors[color] || colors.blue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Connect {currentPlatform.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Platform Info */}
          <div className={`p-4 rounded-lg border-2 border-dashed ${getColorClasses(currentPlatform.color)} dark:bg-gray-700/50 dark:border-gray-600`}>
            <p className="text-sm dark:text-gray-300">{currentPlatform.description}</p>
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
              <span>Example:</span>
              <a 
                href={currentPlatform.exampleUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
              >
                <span>{currentPlatform.exampleUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentPlatform.name} Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setValidationResult(null);
                  setError('');
                }}
                placeholder={currentPlatform.placeholder}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                  validationResult === 'valid' 
                    ? 'border-green-500 focus:ring-green-500' 
                    : validationResult === 'invalid' || error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
                required
              />
              
              {/* Validation Icons */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidating && <Loader className="w-5 h-5 text-blue-500 animate-spin" />}
                {validationResult === 'valid' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {(validationResult === 'invalid' || error) && <AlertCircle className="w-5 h-5 text-red-500" />}
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
            
            {/* Success Message */}
            {validationResult === 'valid' && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Username verified successfully!</span>
              </p>
            )}
          </div>

          {/* Profile Preview */}
          {username && !error && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Profile will be linked to:</p>
              <a 
                href={currentPlatform.exampleUrl?.replace('username', username)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <span className="font-mono text-sm">{currentPlatform.exampleUrl?.replace('username', username)}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            
            {validationResult === 'valid' ? (
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Connect Platform
              </button>
            ) : (
              <button
                type="button"
                onClick={validateUsername}
                disabled={!username.trim() || isValidating}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isValidating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <span>Validate Username</span>
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PlatformModal;
