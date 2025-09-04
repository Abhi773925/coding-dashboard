import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Users,
  Copy,
  Code2,
  MessageCircle,
  Volume2
} from 'lucide-react';

const CollabNotifications = () => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.autoHide !== false) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);
      }
    });
  }, [notifications]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Expose functions globally for other components to use
  useEffect(() => {
    window.collabNotify = {
      success: (message, options = {}) => addNotification({
        type: 'success',
        message,
        icon: Check,
        ...options
      }),
      error: (message, options = {}) => addNotification({
        type: 'error',
        message,
        icon: AlertCircle,
        ...options
      }),
      warning: (message, options = {}) => addNotification({
        type: 'warning',
        message,
        icon: AlertTriangle,
        ...options
      }),
      info: (message, options = {}) => addNotification({
        type: 'info',
        message,
        icon: Info,
        ...options
      }),
      userJoined: (userName, options = {}) => addNotification({
        type: 'user',
        message: `${userName} joined the session`,
        icon: Users,
        ...options
      }),
      userLeft: (userName, options = {}) => addNotification({
        type: 'user',
        message: `${userName} left the session`,
        icon: Users,
        ...options
      }),
      codeCopied: (options = {}) => addNotification({
        type: 'success',
        message: 'Code copied to clipboard',
        icon: Copy,
        ...options
      }),
      codeExecuted: (userName, executionTime, options = {}) => addNotification({
        type: 'code',
        message: `${userName} executed code in ${executionTime}ms`,
        icon: Code2,
        ...options
      }),
      newMessage: (userName, options = {}) => addNotification({
        type: 'message',
        message: `New message from ${userName}`,
        icon: MessageCircle,
        ...options
      }),
      custom: (notification) => addNotification(notification)
    };

    return () => {
      delete window.collabNotify;
    };
  }, []);

  const getNotificationStyle = (type) => {
    const styles = {
      success: {
        bg: isDarkMode ? 'bg-green-900/90 border-green-700' : 'bg-green-50 border-green-200',
        text: isDarkMode ? 'text-green-300' : 'text-green-800',
        icon: isDarkMode ? 'text-green-400' : 'text-green-600'
      },
      error: {
        bg: isDarkMode ? 'bg-red-900/90 border-red-700' : 'bg-red-50 border-red-200',
        text: isDarkMode ? 'text-red-300' : 'text-red-800',
        icon: isDarkMode ? 'text-red-400' : 'text-red-600'
      },
      warning: {
        bg: isDarkMode ? 'bg-yellow-900/90 border-yellow-700' : 'bg-yellow-50 border-yellow-200',
        text: isDarkMode ? 'text-yellow-300' : 'text-yellow-800',
        icon: isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
      },
      info: {
        bg: isDarkMode ? 'bg-blue-900/90 border-blue-700' : 'bg-blue-50 border-blue-200',
        text: isDarkMode ? 'text-blue-300' : 'text-blue-800',
        icon: isDarkMode ? 'text-blue-400' : 'text-blue-600'
      },
      user: {
        bg: isDarkMode ? 'bg-purple-900/90 border-purple-700' : 'bg-purple-50 border-purple-200',
        text: isDarkMode ? 'text-purple-300' : 'text-purple-800',
        icon: isDarkMode ? 'text-purple-400' : 'text-purple-600'
      },
      code: {
        bg: isDarkMode ? 'bg-indigo-900/90 border-indigo-700' : 'bg-indigo-50 border-indigo-200',
        text: isDarkMode ? 'text-indigo-300' : 'text-indigo-800',
        icon: isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
      },
      message: {
        bg: isDarkMode ? 'bg-teal-900/90 border-teal-700' : 'bg-teal-50 border-teal-200',
        text: isDarkMode ? 'text-teal-300' : 'text-teal-800',
        icon: isDarkMode ? 'text-teal-400' : 'text-teal-600'
      }
    };

    return styles[type] || styles.info;
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const style = getNotificationStyle(notification.type);
          const IconComponent = notification.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg max-w-sm w-full pointer-events-auto ${style.bg}`}
            >
              <div className={`flex-shrink-0 ${style.icon}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                {notification.title && (
                  <div className={`font-semibold text-sm mb-1 ${style.text}`}>
                    {notification.title}
                  </div>
                )}
                <div className={`text-sm ${style.text} break-words`}>
                  {notification.message}
                </div>
              </div>

              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded transition-colors ${
                    isDarkMode 
                      ? 'bg-white/20 text-white hover:bg-white/30' 
                      : 'bg-black/10 text-gray-700 hover:bg-black/20'
                  }`}
                >
                  {notification.action.label}
                </button>
              )}

              <button
                onClick={() => removeNotification(notification.id)}
                className={`flex-shrink-0 p-1 rounded transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-white/20 text-gray-400 hover:text-white' 
                    : 'hover:bg-black/10 text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Hook for using notifications
export const useCollabNotifications = () => {
  return {
    success: (message, options) => window.collabNotify?.success(message, options),
    error: (message, options) => window.collabNotify?.error(message, options),
    warning: (message, options) => window.collabNotify?.warning(message, options),
    info: (message, options) => window.collabNotify?.info(message, options),
    userJoined: (userName, options) => window.collabNotify?.userJoined(userName, options),
    userLeft: (userName, options) => window.collabNotify?.userLeft(userName, options),
    codeCopied: (options) => window.collabNotify?.codeCopied(options),
    codeExecuted: (userName, executionTime, options) => window.collabNotify?.codeExecuted(userName, executionTime, options),
    newMessage: (userName, options) => window.collabNotify?.newMessage(userName, options),
    custom: (notification) => window.collabNotify?.custom(notification)
  };
};

export default CollabNotifications;
