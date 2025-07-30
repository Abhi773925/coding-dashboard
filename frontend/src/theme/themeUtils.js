// Theme Utility Functions
// Centralized functions for consistent theming across components

export const getButtonClasses = (isDarkMode, variant = 'primary') => {
  const variants = {
    primary: isDarkMode
      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"
      : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
    secondary: isDarkMode
      ? "bg-slate-800/70 text-zinc-100 hover:bg-slate-700/70 border border-slate-700/50"
      : "bg-gray-100/70 text-gray-900 hover:bg-gray-200/70 border border-gray-200/50",
    outline: isDarkMode
      ? "border-slate-600/40 text-slate-300 hover:bg-slate-800/40 hover:border-indigo-500/40"
      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50/40 hover:border-indigo-300"
  };
  
  return `${variants[variant]} transition-all duration-300 transform hover:scale-105`;
};

export const getCardClasses = (isDarkMode) => {
  return isDarkMode
    ? "bg-slate-800/70 border-slate-700/50 shadow-2xl shadow-black/40"
    : "bg-white/80 border-gray-200/50 shadow-xl";
};

export const getTextClasses = (isDarkMode, variant = 'primary') => {
  const variants = {
    primary: isDarkMode ? "text-white" : "text-gray-900",
    secondary: isDarkMode ? "text-slate-400" : "text-gray-600",
    accent: isDarkMode ? "text-indigo-400" : "text-indigo-600",
    muted: isDarkMode ? "text-slate-500" : "text-gray-500"
  };
  
  return variants[variant];
};

export const getBrandGradient = (isDarkMode) => {
  return isDarkMode
    ? "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
    : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600";
};

export const getPageBackground = (isDarkMode) => {
  return isDarkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900";
};

export const getDifficultyColors = (difficulty, isDarkMode) => {
  const colors = {
    easy: isDarkMode ? "bg-emerald-800 text-emerald-200" : "bg-green-600 text-green-100",
    medium: isDarkMode ? "bg-yellow-800 text-yellow-200" : "bg-yellow-600 text-yellow-100", 
    hard: isDarkMode ? "bg-red-800 text-red-200" : "bg-red-600 text-red-100"
  };
  
  return colors[difficulty.toLowerCase()] || colors.medium;
};

export const getPlatformColors = (platform, isDarkMode) => {
  const platforms = {
    leetcode: {
      light: {
        iconBg: "bg-orange-100",
        iconText: "text-orange-600",
        progress: "bg-orange-600",
        border: "border-orange-200/50"
      },
      dark: {
        iconBg: "bg-orange-900/30",
        iconText: "text-orange-300", 
        progress: "bg-orange-600",
        border: "border-orange-700/50"
      }
    },
    codeforces: {
      light: {
        iconBg: "bg-indigo-100",
        iconText: "text-indigo-600",
        progress: "bg-indigo-500",
        border: "border-indigo-200/50"
      },
      dark: {
        iconBg: "bg-indigo-900/30",
        iconText: "text-indigo-300",
        progress: "bg-indigo-500",
        border: "border-indigo-700/50"
      }
    },
    github: {
      light: {
        iconBg: "bg-blue-100", 
        iconText: "text-gray-700",
        progress: "bg-gray-700",
        border: "border-gray-200/50"
      },
      dark: {
        iconBg: "bg-blue-900/30",
        iconText: "text-gray-300",
        progress: "bg-gray-300", 
        border: "border-gray-700/50"
      }
    },
    geeksforgeeks: {
      light: {
        iconBg: "bg-green-100",
        iconText: "text-green-600",
        progress: "bg-green-600",
        border: "border-green-200/50"
      },
      dark: {
        iconBg: "bg-green-900/30",
        iconText: "text-green-300",
        progress: "bg-green-600",
        border: "border-green-700/50"
      }
    }
  };
  
  const mode = isDarkMode ? 'dark' : 'light';
  return platforms[platform]?.[mode] || platforms.github[mode];
};

export const getCourseColors = (color, isDarkMode) => {
  const courses = {
    indigo: {
      light: {
        text: "text-indigo-600",
        bgLight: "bg-indigo-100",
        bgDark: "bg-indigo-900/30",
        gradientFrom: "from-indigo-600",
        gradientTo: "to-blue-600",
        orb: "rgba(99, 102, 241, 0.2)"
      },
      dark: {
        text: "text-indigo-300", 
        bgLight: "bg-indigo-100",
        bgDark: "bg-indigo-900/30",
        gradientFrom: "from-indigo-400",
        gradientTo: "to-blue-400",
        orb: "rgba(99, 102, 241, 0.4)"
      }
    },
    blue: {
      light: {
        text: "text-blue-600",
        bgLight: "bg-blue-100",
        bgDark: "bg-blue-900/30",
        gradientFrom: "from-blue-600",
        gradientTo: "to-indigo-600", 
        orb: "rgba(37, 99, 235, 0.2)"
      },
      dark: {
        text: "text-blue-300",
        bgLight: "bg-blue-100", 
        bgDark: "bg-blue-900/30",
        gradientFrom: "from-blue-400",
        gradientTo: "to-indigo-400",
        orb: "rgba(59, 130, 246, 0.4)"
      }
    }
  };
  
  const mode = isDarkMode ? 'dark' : 'light';
  return courses[color]?.[mode] || courses.indigo[mode];
};

// Animation classes
export const getAnimationClasses = () => {
  return {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up", 
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    float: "animate-float"
  };
};

// Shadow classes based on theme
export const getShadowClasses = (isDarkMode, intensity = 'normal') => {
  const intensities = {
    light: isDarkMode ? "shadow-sm shadow-black/20" : "shadow-sm",
    normal: isDarkMode ? "shadow-lg shadow-black/30" : "shadow-lg",
    heavy: isDarkMode ? "shadow-2xl shadow-black/50" : "shadow-2xl",
    glow: isDarkMode ? "shadow-2xl shadow-purple-500/20" : "shadow-2xl shadow-purple-500/10"
  };
  
  return intensities[intensity] || intensities.normal;
};
