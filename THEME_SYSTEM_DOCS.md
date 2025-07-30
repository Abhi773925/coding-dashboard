# PrepMate Color Theme System Documentation

## Overview
यह comprehensive color theme system सभी components में consistent styling provide करता है। यह centralized approach के साथ dark और light modes को support करता है।

## Architecture

### 1. Core Files
- `src/theme/colorTheme.js` - Central color configuration
- `src/theme/themeUtils.js` - Utility functions 
- `src/theme/globalTheme.css` - CSS variables and utility classes
- `src/components/context/ThemeContext.jsx` - Theme context provider

### 2. Theme Context
```jsx
const { isDarkMode, colors, schemes, toggleTheme } = useTheme();
```

## Color System

### Primary Colors
```js
// Light Mode
primary: {
  gradient: "from-purple-600 via-blue-600 to-indigo-600",
  purple: "text-purple-600",
  blue: "text-blue-600", 
  indigo: "text-indigo-600"
}

// Dark Mode  
primary: {
  gradient: "from-purple-400 via-blue-400 to-cyan-400",
  purple: "text-purple-400",
  blue: "text-blue-400",
  indigo: "text-indigo-400"
}
```

### Component Colors

#### Cards
```js
card: {
  light: {
    bg: "bg-white/80",
    border: "border-gray-200/50", 
    shadow: "shadow-xl"
  },
  dark: {
    bg: "bg-slate-800/70",
    border: "border-slate-700/50",
    shadow: "shadow-2xl shadow-black/40"
  }
}
```

#### Buttons
```js
button: {
  primary: {
    light: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
    dark: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"
  }
}
```

#### Text
```js
text: {
  light: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    accent: "text-indigo-600"
  },
  dark: {
    primary: "text-white", 
    secondary: "text-slate-400",
    accent: "text-indigo-400"
  }
}
```

## Platform Colors

### Coding Platforms
```js
platforms: {
  leetcode: {
    light: { iconBg: "bg-orange-100", iconText: "text-orange-600" },
    dark: { iconBg: "bg-orange-900/30", iconText: "text-orange-300" }
  },
  codeforces: {
    light: { iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
    dark: { iconBg: "bg-indigo-900/30", iconText: "text-indigo-300" }
  },
  github: {
    light: { iconBg: "bg-blue-100", iconText: "text-gray-700" },
    dark: { iconBg: "bg-blue-900/30", iconText: "text-gray-300" }
  },
  geeksforgeeks: {
    light: { iconBg: "bg-green-100", iconText: "text-green-600" },
    dark: { iconBg: "bg-green-900/30", iconText: "text-green-300" }
  }
}
```

## Difficulty Colors
```js
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
}
```

## Usage Examples

### Using Theme Context
```jsx
import { useTheme } from '../context/ThemeContext';

const Component = () => {
  const { isDarkMode, colors, schemes } = useTheme();
  
  return (
    <div className={schemes.pageBackground(isDarkMode)}>
      <h1 className={`${schemes.brandGradient(isDarkMode)} bg-clip-text text-transparent`}>
        Title
      </h1>
      <button className={schemes.primaryButton(isDarkMode)}>
        Click me
      </button>
    </div>
  );
};
```

### Using Utility Functions
```jsx
import { getButtonClasses, getCardClasses, getTextClasses } from '../theme/themeUtils';

const Component = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={getCardClasses(isDarkMode)}>
      <h2 className={getTextClasses(isDarkMode, 'primary')}>Title</h2>
      <p className={getTextClasses(isDarkMode, 'secondary')}>Description</p>
      <button className={getButtonClasses(isDarkMode, 'primary')}>
        Action
      </button>
    </div>
  );
};
```

### Using CSS Variables
```jsx
// Direct CSS variable usage
<div className="theme-card">
  <h2 className="theme-text-primary">Title</h2>
  <p className="theme-text-secondary">Description</p>
  <button className="theme-button-primary">Action</button>
</div>
```

## Component Updates

### Updated Components
1. **HeroSection** - Brand gradient, button styles
2. **Navigation** - Background, text colors
3. **Dsacard** - Card backgrounds, gradients  
4. **Profile** - Platform colors, difficulty badges
5. **Footer** - Text colors, social icons
6. **Learning** - Card styles, text hierarchy
7. **CourseProgress** - Difficulty colors, backgrounds

### Implementation Pattern
```jsx
// Before
className={isDarkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"}

// After  
className={schemes.pageBackground(isDarkMode)}
```

## Benefits

### 1. Consistency
- Unified color palette across all components
- Consistent hover states and transitions
- Standardized spacing and shadows

### 2. Maintainability  
- Centralized color management
- Easy theme updates
- Reusable utility functions

### 3. Performance
- CSS variables for optimal performance
- Reduced bundle size with shared utilities
- Efficient theme switching

### 4. Developer Experience
- Type-safe theme access
- Intuitive naming conventions
- Easy to extend and customize

## Future Enhancements

### 1. Multiple Themes
```js
// Add more color schemes
themes: {
  default: { /* current theme */ },
  ocean: { /* blue-based theme */ },
  forest: { /* green-based theme */ },
  sunset: { /* orange/red theme */ }
}
```

### 2. User Customization
```js
// Allow users to customize colors
userPreferences: {
  primaryColor: '#custom-color',
  accentColor: '#custom-accent',
  customGradient: true
}
```

### 3. System Theme Detection
```js
// Auto-detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

## Best Practices

### 1. Always Use Theme Context
```jsx
// ✅ Good
const { isDarkMode, colors, schemes } = useTheme();

// ❌ Avoid
const isDarkMode = localStorage.getItem('theme') === 'dark';
```

### 2. Use Utility Functions
```jsx
// ✅ Good
className={getButtonClasses(isDarkMode, 'primary')}

// ❌ Avoid  
className={isDarkMode ? "bg-purple-600..." : "bg-purple-700..."}
```

### 3. Consistent Naming
```jsx
// ✅ Good
text-primary, text-secondary, text-accent

// ❌ Avoid
text-main, text-sub, text-special
```

## Migration Guide

### Existing Components
1. Import useTheme from context
2. Replace hardcoded classes with scheme functions
3. Use platform/difficulty color utilities
4. Test both light and dark modes

### Example Migration
```jsx
// Before
const Component = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className={isDarkMode ? "bg-slate-900" : "bg-white"}>
      <button className={isDarkMode ? "bg-purple-600" : "bg-purple-700"}>
        Click
      </button>
    </div>
  );
};

// After
const Component = () => {
  const { isDarkMode, schemes } = useTheme();
  return (
    <div className={schemes.pageBackground(isDarkMode)}>
      <button className={schemes.primaryButton(isDarkMode)}>
        Click
      </button>
    </div>
  );
};
```

यह system अब सभी components में consistent और professional look provide करता है। सभी colors synchronized हैं और theme switching smooth और fast है।
