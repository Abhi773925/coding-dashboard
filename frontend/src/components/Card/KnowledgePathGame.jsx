import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Lightbulb, Star, Trophy, ArrowRight } from 'lucide-react';

const cardData = [
  {
    title: "Creative Thinking",
    description: "Boost your creativity with innovative brainstorming techniques",
    level: "Beginner",
    icon: <Lightbulb />,
    color: "indigo",
    features: ["Lateral Thinking", "Mind Mapping", "Random Connections"],
    action: "Start Learning"
  },
  {
    title: "Problem Solving",
    description: "Master structured approaches to solve complex problems",
    level: "Intermediate",
    icon: <Star />,
    color: "emerald",
    features: ["Root Cause Analysis", "SCAMPER Method", "Design Thinking"],
    action: "Explore Methods"
  },
  {
    title: "Innovation Mastery",
    description: "Transform ideas into impactful solutions that create value",
    level: "Advanced",
    icon: <Trophy />,
    color: "purple",
    features: ["Prototype Development", "Idea Validation", "Implementation"],
    action: "Master Innovation"
  }
];

const StyledCards = () => {
  const { isDarkMode } = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleAction = (index) => {
    console.log(`Action clicked for card ${index}`);
    // You can add your navigation or action logic here
  };

  return (
    <div 
      className={`
        min-h-screen py-12 px-4
        ${isDarkMode 
          ? 'bg-zinc-950 text-gray-100' 
          : 'bg-white text-gray-900'}
        transition-colors duration-300
      `}
    >
      <div className="max-w-6xl mx-auto">
        <h2 
          className={`
            text-4xl font-bold text-center mb-12
            bg-clip-text text-transparent
            ${isDarkMode 
              ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500' 
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'}
          `}
        >
          Enhance Your Skills
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {cardData.map((card, index) => (
            <div 
              key={index}
              className={`
                relative overflow-hidden rounded-3xl 
                transform transition-all duration-500 ease-in-out
                border-2 group
                ${hoveredCard === index 
                  ? 'scale-105 shadow-2xl' 
                  : 'scale-100 shadow-lg'}
                ${isDarkMode 
                  ? `bg-zinc-800 border-zinc-700 hover:border-zinc-600` 
                  : `bg-white border-gray-200 hover:border-gray-300`}
              `}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Animated Gradient Background */}
              <div 
                className={`
                  absolute inset-0 opacity-10 
                  bg-gradient-to-br 
                  ${
                    card.color === 'indigo' 
                      ? 'from-indigo-600 to-purple-600' 
                    : card.color === 'emerald'
                      ? 'from-emerald-600 to-teal-600'
                    : 'from-purple-600 to-pink-600'
                  }
                  transition-all duration-500
                  ${hoveredCard === index ? 'opacity-30' : 'opacity-10'}
                `}
              />

              {/* Hover Effect Overlay */}
              <div 
                className={`
                  absolute inset-0 bg-black/0 group-hover:bg-black/5 
                  transition-all duration-500 z-20
                `}
              />

              <div className="relative p-6 z-30">
                {/* Icon Container */}
                <div 
                  className={`
                    mb-6 w-20 h-20 rounded-full flex items-center justify-center
                    ${
                      card.color === 'indigo' 
                        ? (isDarkMode 
                            ? 'bg-indigo-900/40 text-indigo-400' 
                            : 'bg-indigo-100 text-indigo-600')
                      : card.color === 'emerald'
                        ? (isDarkMode 
                            ? 'bg-emerald-900/40 text-emerald-400' 
                            : 'bg-emerald-100 text-emerald-600')
                      : (isDarkMode 
                          ? 'bg-purple-900/40 text-purple-400' 
                          : 'bg-purple-100 text-purple-600')
                    }
                    transition-transform duration-500
                    transform 
                    ${hoveredCard === index 
                      ? 'rotate-12 scale-110 shadow-lg' 
                      : 'rotate-0 scale-100'}
                  `}
                >
                  {React.cloneElement(card.icon, { 
                    size: 36, 
                    strokeWidth: hoveredCard === index ? 1.5 : 1 
                  })}
                </div>

                {/* Card Title */}
                <h3 
                  className={`
                    text-2xl font-bold mb-3 
                    transition-colors duration-300
                    ${isDarkMode 
                      ? 'text-white group-hover:text-opacity-90' 
                      : 'text-gray-900 group-hover:text-opacity-90'}
                  `}
                >
                  {card.title}
                </h3>

                {/* Card Description */}
                <p 
                  className={`
                    mb-6 text-base
                    ${isDarkMode 
                      ? 'text-zinc-400' 
                      : 'text-gray-600'}
                    transition-all duration-300
                    group-hover:text-opacity-80
                  `}
                >
                  {card.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {card.features.map((feature, featureIndex) => (
                    <span 
                      key={featureIndex}
                      className={`
                        px-2 py-1 rounded-full text-xs
                        ${
                          card.color === 'indigo' 
                            ? (isDarkMode 
                                ? 'bg-indigo-900/30 text-indigo-300' 
                                : 'bg-indigo-100 text-indigo-600')
                          : card.color === 'emerald'
                            ? (isDarkMode 
                                ? 'bg-emerald-900/30 text-emerald-300' 
                                : 'bg-emerald-100 text-emerald-600')
                            : (isDarkMode 
                                ? 'bg-purple-900/30 text-purple-300' 
                                : 'bg-purple-100 text-purple-600')
                        }
                      `}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div 
                  className={`
                    flex items-center justify-between mt-4
                    ${isDarkMode ? 'text-zinc-300' : 'text-gray-500'}
                  `}
                >
                  <span 
                    className={`
                      px-3 py-1 rounded-full text-sm
                      ${
                        card.color === 'indigo' 
                          ? (isDarkMode 
                              ? 'bg-indigo-900/30 text-indigo-300' 
                              : 'bg-indigo-100 text-indigo-600')
                        : card.color === 'emerald'
                          ? (isDarkMode 
                              ? 'bg-emerald-900/30 text-emerald-300' 
                              : 'bg-emerald-100 text-emerald-600')
                        : (isDarkMode 
                            ? 'bg-purple-900/30 text-purple-300' 
                            : 'bg-purple-100 text-purple-600')
                      }
                    `}
                  >
                    {card.level}
                  </span>
                  <button 
                    onClick={() => handleAction(index)}
                    className={`
                      flex items-center group
                      ${isDarkMode 
                        ? 'text-indigo-300 hover:text-indigo-200' 
                        : 'text-indigo-600 hover:text-indigo-700'}
                      transition-all duration-300
                    `}
                  >
                    <span className="mr-2 group-hover:mr-3 transition-all">
                      {card.action}
                    </span>
                    <ArrowRight 
                      className="transform transition-transform group-hover:translate-x-1" 
                      size={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyledCards;