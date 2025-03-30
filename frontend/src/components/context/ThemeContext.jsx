import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the ThemeContext
export const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Updated theme initialization with error handling
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme !== null ? JSON.parse(savedTheme) : true;
    } catch (error) {
      console.error('Error parsing theme from localStorage:', error);
      return true; // Default to dark mode if parsing fails
    }
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('theme', JSON.stringify(isDarkMode));
      
      // Update body class for global styling
      if (isDarkMode) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [isDarkMode]);

  // Theme toggle method
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Context value
  const contextValue = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};