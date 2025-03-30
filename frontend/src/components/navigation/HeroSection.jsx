import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Code, BookOpen, Play } from 'lucide-react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

const HeroSection = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`
        ${isDarkMode
          ? 'bg-zinc-950 text-gray-100'
          : 'bg-white text-gray-900'}
        min-h-screen flex items-center justify-center 
        px-4 py-16 transition-colors duration-300
      `}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1
          className={`
            text-5xl md:text-6xl font-bold mb-6 leading-tight
            ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
          `}
        >
          Learn to Code, <span
            className={`
              ${isDarkMode
                ? 'text-indigo-400'
                : 'text-indigo-600'}
            `}
          >
            Create Anything
          </span>
        </h1>
        <p
          className={`
            text-xl mb-10 max-w-2xl mx-auto
            ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}
          `}
        >
          CodingKaro is your gateway to transforming ideas into reality. Whether you're a beginner or an experienced developer, we'll help you unlock your coding potential.
        </p>
        <div className="flex justify-center space-x-4 mb-12">
          <Link
            to="/allcourse"
            className={`
              flex items-center px-6 py-3 rounded-full
              transition duration-300
              transform hover:scale-105
              shadow-lg
              ${isDarkMode
                ? 'bg-zinc-800/50 text-indigo-300 hover:bg-zinc-800'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'}
            `}
          >
            <BookOpen className="mr-2" />
            Start Learning
          </Link>
          <Link
            to="/projects"
            className={`
              flex items-center px-6 py-3 rounded-full
              border transition duration-300
              transform hover:scale-105
              shadow-md
              ${isDarkMode
                ? 'bg-zinc-800/30 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                : 'bg-white text-indigo-600 border-indigo-600 hover:bg-gray-50'}
            `}
          >
            <Code className="mr-2" />
            View Projects
          </Link>
        </div>
        <div
          className={`
            flex justify-center items-center space-x-4
            ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}
          `}
        >
          <div className="flex items-center">
            <Code
              className={`
                mr-2
                ${isDarkMode
                  ? 'text-indigo-400'
                  : 'text-indigo-600'}
              `}
            />
            <span>100+ Coding Tutorials</span>
          </div>
          <div className="flex items-center">
            <Play
              className={`
                mr-2
                ${isDarkMode
                  ? 'text-emerald-400'
                  : 'text-emerald-600'}
              `}
            />
            <span>Interactive Learning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
