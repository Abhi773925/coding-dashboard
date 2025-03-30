import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Code, 
  Terminal, 
  BookOpen, 
  Zap, 
  Layers, 
  Cpu, 
  ChevronRight 
} from 'lucide-react';
import DSASheetCard from '../Card/DSASheetCard';
const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { 
      icon: <Code />, 
      title: 'Project Tracking', 
      description: 'Seamlessly monitor your project progress with intuitive visualizations and real-time insights.' 
    },
    { 
      icon: <Terminal />, 
      title: 'Code Insights', 
      description: 'Deep dive into your coding patterns, performance metrics, and optimization opportunities.' 
    },
    { 
      icon: <BookOpen />, 
      title: 'Learning Path', 
      description: 'Personalized skill development roadmap tailored to your coding journey and career goals.' 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`relative min-h-[600px] w-full overflow-hidden transition-colors duration-300 flex justify-center items-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#0a0c1a] to-[#1a1e2f] text-white' 
          : 'bg-gradient-to-br from-gray-100 to-white text-gray-900'
      }`}
    >
      {/* Mode Toggle with Glow Effect */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-6 right-6 z-20 p-3 rounded-full shadow-lg transform transition-all duration-300 hover:rotate-12 hover:scale-110 
          ${isDarkMode 
            ? 'bg-[#1a1e2f] text-purple-400 border border-[#2a2f3f] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
            : 'bg-white text-gray-800 border border-gray-200 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
          } 
          hover:ring-2 hover:ring-purple-500/50 transition-shadow`}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text and Feature Section */}
        <div className="space-y-8 animate-fade-in-left">
          <div>
            <h1 className={`text-5xl font-extrabold mb-4 tracking-tight ${
              isDarkMode 
                ? 'text-white' 
                : 'text-gray-900'
            }`}>
              Your Coding <span className="text-purple-500">Companion</span>
            </h1>
            <p className={`text-xl mb-8 ${
              isDarkMode 
                ? 'text-gray-400' 
                : 'text-gray-700'
            }`}>
              Elevate your development workflow with intelligent insights, progress tracking, and personalized learning.
            </p>
          </div>

          {/* Interactive Feature Showcase with Enhanced Glow */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index} 
                onClick={() => setActiveFeature(index)}
                className={`cursor-pointer p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] group 
                  ${activeFeature === index 
                    ? (isDarkMode 
                      ? 'bg-[#1a1e2f] border border-purple-700 shadow-lg shadow-purple-900/50' 
                      : 'bg-white border border-purple-500 shadow-xl shadow-purple-300/50')
                    : (isDarkMode 
                      ? 'bg-[#262a3a] border border-transparent hover:border-[#2a2f3f]' 
                      : 'bg-gray-100 border border-transparent hover:border-gray-200')
                  }
                  hover:ring-2 hover:ring-purple-500/30`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full transition-colors group-hover:scale-110 ${
                    activeFeature === index
                      ? (isDarkMode 
                        ? 'bg-purple-800 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                        : 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]')
                      : (isDarkMode 
                        ? 'bg-[#1a1e2f] text-purple-400' 
                        : 'bg-gray-200 text-purple-600')
                  }`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg transition-colors ${
                      activeFeature === index
                        ? 'text-white' 
                        : (isDarkMode ? 'text-gray-300' : 'text-gray-800')
                    }`}>
                      {feature.title}
                    </h3>
                    {activeFeature === index && (
                      <p className={`text-sm mt-1 transition-opacity ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons with Glow Effects */}
          <div className="flex space-x-4">
            <button 
              className={`group flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 
                ${isDarkMode 
                  ? 'bg-purple-800 text-white hover:bg-purple-700 hover:shadow-[0_10px_25px_-10px_rgba(168,85,247,0.5)]' 
                  : 'bg-purple-500 text-white hover:bg-purple-600 hover:shadow-[0_10px_25px_-10px_rgba(168,85,247,0.4)]'
                }
                hover:ring-2 hover:ring-purple-500/50`}
            >
              Get Started
              <ChevronRight 
                className="ml-2 transform transition-transform group-hover:translate-x-1" 
                size={20} 
              />
            </button>
            <button 
              className={`group flex items-center px-6 py-3 rounded-lg font-semibold border transition-all duration-300 transform hover:-translate-y-1 
                ${isDarkMode 
                  ? 'border-[#2a2f3f] text-gray-400 hover:border-purple-600 hover:text-white hover:bg-[#262a3a] hover:shadow-[0_10px_25px_-10px_rgba(168,85,247,0.3)]' 
                  : 'border-gray-300 text-gray-700 hover:border-purple-500 hover:bg-purple-50 hover:shadow-[0_10px_25px_-10px_rgba(168,85,247,0.2)]'
                }
                hover:ring-2 hover:ring-purple-500/30`}
            >
              Learn More
              <Zap 
                className="ml-2 transform transition-transform group-hover:rotate-12" 
                size={20} 
              />
            </button>
          </div>
        </div>

        {/* Code Editor Mockup with Glow Effect */}
        <div className="relative flex justify-center animate-fade-in-right">
          <div 
            className={`w-full max-w-[500px] h-[500px] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 
              ${isDarkMode 
                ? 'bg-[#1a1e2f] border border-[#2a2f3f] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
                : 'bg-white border border-gray-200 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
              }
              hover:ring-2 hover:ring-purple-500/30`}
          >
            <div className={`p-6 h-full ${
              isDarkMode 
                ? 'bg-[#262a3a]' 
                : 'bg-gray-100'
            }`}>
              <div className="flex space-x-2 mb-4">
                {['red', 'yellow', 'green'].map((color) => (
                  <div 
                    key={color} 
                    className={`w-4 h-4 rounded-full bg-${color}-500`}
                  ></div>
                ))}
              </div>
              <div 
                className={`w-full h-[calc(100%-50px)] rounded-lg p-4 relative overflow-hidden ${
                  isDarkMode 
                    ? 'bg-[#1a1e2f] text-green-400' 
                    : 'bg-white text-green-600'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-50 animate-pulse"></div>
                <p>{'>'} Initializing dashboard analytics...</p>
                <p className="ml-4 animate-pulse">|</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Blobs with Subtle Glow */}
      <div 
        className={`absolute inset-0 overflow-hidden pointer-events-none ${
          isDarkMode 
            ? 'opacity-30' 
            : 'opacity-10'
        }`}
      >
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-900 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-900 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      {/* <DSASheetCard isDarkMode={isDarkMode} /> */}
    </div>
  );
};

export default Dashboard;