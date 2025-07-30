import React from 'react';
import { useTheme } from '../components/context/ThemeContext';
import { 
  getButtonClasses, 
  getCardClasses, 
  getTextClasses, 
  getBrandGradient, 
  getPageBackground,
  getDifficultyColors,
  getPlatformColors,
  getShadowClasses
} from '../theme/themeUtils';

const ThemeDemo = () => {
  const { isDarkMode, toggleTheme, colors, schemes } = useTheme();

  return (
    <div className={`min-h-screen p-8 ${schemes.pageBackground(isDarkMode)} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={`text-4xl font-bold ${getBrandGradient(isDarkMode)} bg-clip-text text-transparent`}>
            PrepMate Theme System
          </h1>
          <p className={getTextClasses(isDarkMode, 'secondary')}>
            Unified color theme across all components
          </p>
          <button
            onClick={toggleTheme}
            className={`${getButtonClasses(isDarkMode, 'primary')} px-6 py-3 rounded-lg font-semibold`}
          >
            Toggle Theme ({isDarkMode ? 'Dark' : 'Light'})
          </button>
        </div>

        {/* Button Showcase */}
        <div className={`${getCardClasses(isDarkMode)} p-6 rounded-xl`}>
          <h2 className={`text-2xl font-bold mb-4 ${getTextClasses(isDarkMode, 'primary')}`}>
            Button Styles
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className={`${getButtonClasses(isDarkMode, 'primary')} px-4 py-2 rounded-lg`}>
              Primary Button
            </button>
            <button className={`${getButtonClasses(isDarkMode, 'secondary')} px-4 py-2 rounded-lg`}>
              Secondary Button
            </button>
            <button className={`${getButtonClasses(isDarkMode, 'outline')} px-4 py-2 rounded-lg border-2`}>
              Outline Button
            </button>
          </div>
        </div>

        {/* Text Styles */}
        <div className={`${getCardClasses(isDarkMode)} p-6 rounded-xl`}>
          <h2 className={`text-2xl font-bold mb-4 ${getTextClasses(isDarkMode, 'primary')}`}>
            Text Styles
          </h2>
          <div className="space-y-2">
            <p className={getTextClasses(isDarkMode, 'primary')}>Primary Text - Main content</p>
            <p className={getTextClasses(isDarkMode, 'secondary')}>Secondary Text - Supporting content</p>
            <p className={getTextClasses(isDarkMode, 'accent')}>Accent Text - Important highlights</p>
            <p className={getTextClasses(isDarkMode, 'muted')}>Muted Text - Less important content</p>
          </div>
        </div>

        {/* Difficulty Colors */}
        <div className={`${getCardClasses(isDarkMode)} p-6 rounded-xl`}>
          <h2 className={`text-2xl font-bold mb-4 ${getTextClasses(isDarkMode, 'primary')}`}>
            Difficulty Levels
          </h2>
          <div className="flex gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColors('easy', isDarkMode)}`}>
              Easy
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColors('medium', isDarkMode)}`}>
              Medium
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColors('hard', isDarkMode)}`}>
              Hard
            </span>
          </div>
        </div>

        {/* Platform Colors */}
        <div className={`${getCardClasses(isDarkMode)} p-6 rounded-xl`}>
          <h2 className={`text-2xl font-bold mb-4 ${getTextClasses(isDarkMode, 'primary')}`}>
            Platform Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['leetcode', 'codeforces', 'github', 'geeksforgeeks'].map(platform => {
              const platformColors = getPlatformColors(platform, isDarkMode);
              return (
                <div key={platform} className={`p-4 rounded-lg ${platformColors.iconBg} ${platformColors.border} border`}>
                  <h3 className={`font-semibold capitalize ${platformColors.iconText}`}>
                    {platform}
                  </h3>
                  <div className={`h-2 rounded-full mt-2 ${platformColors.progress}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Shadow Examples */}
        <div className={`${getCardClasses(isDarkMode)} p-6 rounded-xl`}>
          <h2 className={`text-2xl font-bold mb-4 ${getTextClasses(isDarkMode, 'primary')}`}>
            Shadow Styles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${colors.card.bg} ${getShadowClasses(isDarkMode, 'light')}`}>
              Light Shadow
            </div>
            <div className={`p-4 rounded-lg ${colors.card.bg} ${getShadowClasses(isDarkMode, 'normal')}`}>
              Normal Shadow
            </div>
            <div className={`p-4 rounded-lg ${colors.card.bg} ${getShadowClasses(isDarkMode, 'heavy')}`}>
              Heavy Shadow
            </div>
            <div className={`p-4 rounded-lg ${colors.card.bg} ${getShadowClasses(isDarkMode, 'glow')}`}>
              Glow Shadow
            </div>
          </div>
        </div>

        {/* Color Scheme Information */}
        <div className={`${getCardClasses(isDarkMode)} p-6 rounded-xl`}>
          <h2 className={`text-2xl font-bold mb-4 ${getTextClasses(isDarkMode, 'primary')}`}>
            Current Theme Configuration
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-semibold mb-2 ${getTextClasses(isDarkMode, 'accent')}`}>Primary Colors</h3>
              <div className="space-y-1 text-sm">
                <p className={getTextClasses(isDarkMode, 'secondary')}>Background: {colors.primary.bg.primary}</p>
                <p className={getTextClasses(isDarkMode, 'secondary')}>Secondary: {colors.primary.bg.secondary}</p>
                <p className={getTextClasses(isDarkMode, 'secondary')}>Accent: {colors.primary.bg.accent}</p>
              </div>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${getTextClasses(isDarkMode, 'accent')}`}>Component Colors</h3>
              <div className="space-y-1 text-sm">
                <p className={getTextClasses(isDarkMode, 'secondary')}>Card BG: {colors.card.bg}</p>
                <p className={getTextClasses(isDarkMode, 'secondary')}>Card Border: {colors.card.border}</p>
                <p className={getTextClasses(isDarkMode, 'secondary')}>Navigation: {colors.navigation.bg}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
