// Central Theme Configuration for PrepMate
// This file contains all the color themes used across the application

export const colorTheme = {
  // Primary brand colors
  primary: {
    light: {
      // Main brand gradient
      gradient: {
        from: "from-purple-600",
        via: "via-blue-600", 
        to: "to-indigo-600"
      },
      // Individual colors
      purple: "text-purple-600",
      blue: "text-blue-600",
      indigo: "text-indigo-600",
      // Background variants
      bg: {
        primary: "bg-white",
        secondary: "bg-gray-50",
        accent: "bg-indigo-50"
      }
    },
    dark: {
      // Main brand gradient  
      gradient: {
        from: "from-purple-400",
        via: "via-blue-400",
        to: "to-cyan-400"
      },
      // Individual colors
      purple: "text-purple-400",
      blue: "text-blue-400", 
      indigo: "text-indigo-400",
      // Background variants
      bg: {
        primary: "bg-zinc-900",
        secondary: "bg-slate-800",
        accent: "bg-slate-800/70"
      }
    }
  },

  // Component specific themes
  components: {
    // Cards and containers
    card: {
      light: {
        bg: "bg-white/80",
        border: "border-gray-200/50",
        shadow: "shadow-xl",
        hover: "hover:bg-gray-50/80"
      },
      dark: {
        bg: "bg-slate-800/70", 
        border: "bg-zinc-900",
        shadow: "shadow-2xl shadow-black/40",
        hover: "hover:bg-slate-700/70"
      }
    },

    // Buttons
    button: {
      primary: {
        light: "bg-gradient-to-r from-purple-600 to-blue-600 text-slate-300 hover:from-purple-700 hover:to-blue-700",
        dark: "bg-gradient-to-r from-purple-600 to-blue-600 text-slate-300 hover:from-purple-500 hover:to-blue-500"
      },
      secondary: {
        light: "bg-gray-100/70 text-gray-900 hover:bg-gray-200/70 border border-gray-200/50",
        dark: "bg-slate-800/70 text-zinc-100 hover:bg-slate-700/70 border bg-zinc-900"
      }
    },

    // Navigation
    navigation: {
      light: {
        bg: "bg-white/80",
        border: "border-indigo-100/50",
        text: "text-gray-800",
        hover: "hover:bg-indigo-50/60"
      },
      dark: {
        bg: "bg-[#0f172b]",
        border: "border-gray-700/50", 
        text: "text-gray-100",
        hover: "hover:bg-zinc-900/30"
      }
    },

    // Text colors
    text: {
      light: {
        primary: "text-gray-900",
        secondary: "text-gray-600", 
        accent: "text-indigo-600"
      },
      dark: {
        primary: "text-slate-300",
        secondary: "text-slate-400",
        accent: "text-indigo-400"
      }
    }
  },

  // Feature specific colors
  features: {
    // Profile specific theme
    profile: {
      light: {
        header: {
          bg: "bg-white/90",
          border: "border-gray-200/50",
          shadow: "shadow-xl",
          coverGradient: "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"
        },
        card: {
          bg: "bg-white/80",
          border: "border-gray-200/50",
          shadow: "shadow-lg hover:shadow-xl",
          hover: "hover:bg-white/90"
        },
        stats: {
          primary: "bg-gradient-to-r from-purple-600 to-blue-600",
          secondary: "bg-gradient-to-r from-blue-500 to-indigo-600",
          accent: "bg-gradient-to-r from-indigo-500 to-purple-600",
          success: "bg-gradient-to-r from-emerald-500 to-green-600"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-600",
          accent: "text-purple-600"
        }
      },
      dark: {
        header: {
          bg: "bg-zinc-900",
          border: "bg-zinc-900",
          shadow: "shadow-2xl shadow-black/40",
          coverGradient: "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
        },
        card: {
          bg: "bg-slate-800/70",
          border: "bg-zinc-900",
          shadow: "shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30",
          hover: "hover:bg-slate-700/70"
        },
        stats: {
          primary: "bg-gradient-to-r from-purple-600 to-blue-600",
          secondary: "bg-gradient-to-r from-blue-500 to-indigo-600",
          accent: "bg-gradient-to-r from-indigo-500 to-purple-600",
          success: "bg-gradient-to-r from-emerald-500 to-green-600"
        },
        text: {
          primary: "text-slate-300",
          secondary: "text-slate-400",
          accent: "text-purple-400"
        }
      }
    },

    // Difficulty levels
    difficulty: {
      easy: {
        light: "bg-green-600 text-green-100",
        dark: "bg-emerald-800 text-emerald-200"
      },
      medium: {
        light: "bg-yellow-600 text-yellow-100", 
        dark: "bg-yellow-800 text-yellow-200"
      },
      hard: {
        light: "bg-red-600 text-red-100",
        dark: "bg-red-800 text-red-200"
      }
    },

    // Platform colors
    platforms: {
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
          progress: "bg-zinc-900",
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
    },

    // Course colors
    courses: {
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
    }
  },

  // Animation and visual effects
  effects: {
    light: {
      backdrop: "backdrop-blur-sm",
      glow: "0 25px 50px rgba(0,0,0,0.15)",
      shadow: "0 15px 40px rgba(0,0,0,0.1)"
    },
    dark: {
      backdrop: "backdrop-blur-md", 
      glow: "0 25px 50px rgba(0,0,0,0.5)",
      shadow: "0 15px 40px rgba(0,0,0,0.4)"
    }
  }
};

// Helper function to get theme colors
export const getThemeColors = (isDarkMode) => {
  const mode = isDarkMode ? 'dark' : 'light';
  
  return {
    // Primary colors
    primary: colorTheme.primary[mode],
    
    // Component colors  
    card: colorTheme.components.card[mode],
    button: colorTheme.components.button,
    navigation: colorTheme.components.navigation[mode],
    text: colorTheme.components.text[mode],
    
    // Feature colors
    profile: colorTheme.features.profile[mode],
    difficulty: colorTheme.features.difficulty,
    platforms: colorTheme.features.platforms,
    courses: colorTheme.features.courses,
    
    // Effects
    effects: colorTheme.effects[mode]
  };
};

// Color scheme presets for quick access
export const colorSchemes = {
  brandGradient: (isDarkMode) => isDarkMode 
    ? "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
    : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600",
    
  cardBackground: (isDarkMode) => isDarkMode
    ? "bg-slate-800/70 bg-zinc-900"
    : "bg-white/80 border-gray-200/50",
    
  primaryButton: (isDarkMode) => isDarkMode
    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-slate-300 hover:from-purple-500 hover:to-blue-500"
    : "bg-gradient-to-r from-purple-600 to-blue-600 text-slate-300 hover:from-purple-700 hover:to-blue-700",
    
  pageBackground: (isDarkMode) => isDarkMode
    ? "bg-zinc-900 text-gray-100"
    : "bg-gray-50 text-gray-900"
};
