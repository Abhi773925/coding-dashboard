import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Code, Server, Briefcase, ArrowRight } from 'lucide-react';

const courseData = [
  {
    title: "Data Structures Fundamentals",
    description: "Master the core building blocks of efficient programming",
    level: "Beginner",
    icon: <Code />,
    color: "indigo",
    skills: ["Arrays", "Linked Lists", "Stacks"],
    route: "/courses/data-structures"
  },
  {
    title: "Full Stack Web Development",
    description: "Comprehensive journey through modern web technologies",
    level: "Intermediate",
    icon: <Server />,
    color: "emerald",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    route: "/courses/fullstack"
  },
  {
    title: "Technical Interview Preparation",
    description: "Strategies and practice for acing technical interviews",
    level: "Advanced",
    icon: <Briefcase />,
    color: "purple",
    skills: ["Problem Solving", "Algorithmic Thinking", "Mock Interviews"],
    route: "/courses/interview-prep"
  }
];

const DsaCard = () => {
  const { isDarkMode } = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const handleExplore = (route) => {
    navigate(route);
  };

  return (
    <div 
      className={`
        min-h-screen py-24 px-4
        ${isDarkMode 
          ? 'bg-zinc-950 text-gray-100' 
          : 'bg-white text-gray-900'}
        transition-colors duration-300
      `}
    >
      <div className="max-w-7xl mx-auto">
        <h2 
          className={`
            text-4xl font-bold text-center mb-16
            bg-clip-text text-transparent
            ${isDarkMode 
              ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500' 
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'}
          `}
        >
          Explore Our Courses
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {courseData.map((course, index) => (
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
                relative
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
                    course.color === 'indigo' 
                      ? 'from-indigo-600 to-purple-600' 
                    : course.color === 'emerald'
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
                      course.color === 'indigo' 
                        ? (isDarkMode 
                            ? 'bg-indigo-900/40 text-indigo-400' 
                            : 'bg-indigo-100 text-indigo-600')
                      : course.color === 'emerald'
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
                  {React.cloneElement(course.icon, { 
                    size: 36, 
                    strokeWidth: hoveredCard === index ? 1.5 : 1 
                  })}
                </div>

                {/* Course Title */}
                <h3 
                  className={`
                    text-2xl font-bold mb-3 
                    transition-colors duration-300
                    ${isDarkMode 
                      ? 'text-white group-hover:text-opacity-90' 
                      : 'text-gray-900 group-hover:text-opacity-90'}
                  `}
                >
                  {course.title}
                </h3>

                {/* Course Description */}
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
                  {course.description}
                </p>

                {/* Skills Tags */}
                <div className="flex space-x-2 mb-6">
                  {course.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className={`
                        px-2 py-1 rounded-full text-xs
                        ${
                          course.color === 'indigo' 
                            ? (isDarkMode 
                                ? 'bg-indigo-900/30 text-indigo-300' 
                                : 'bg-indigo-100 text-indigo-600')
                          : course.color === 'emerald'
                            ? (isDarkMode 
                                ? 'bg-emerald-900/30 text-emerald-300' 
                                : 'bg-emerald-100 text-emerald-600')
                            : (isDarkMode 
                                ? 'bg-purple-900/30 text-purple-300' 
                                : 'bg-purple-100 text-purple-600')
                        }
                      `}
                    >
                      {skill}
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
                        course.color === 'indigo' 
                          ? (isDarkMode 
                              ? 'bg-indigo-900/30 text-indigo-300' 
                              : 'bg-indigo-100 text-indigo-600')
                        : course.color === 'emerald'
                          ? (isDarkMode 
                              ? 'bg-emerald-900/30 text-emerald-300' 
                              : 'bg-emerald-100 text-emerald-600')
                        : (isDarkMode 
                            ? 'bg-purple-900/30 text-purple-300' 
                            : 'bg-purple-100 text-purple-600')
                      }
                    `}
                  >
                    {course.level}
                  </span>
                  <button 
                    onClick={() => handleExplore(course.route)}
                    className={`
                      flex items-center group
                      ${isDarkMode 
                        ? 'text-indigo-300 hover:text-indigo-200' 
                        : 'text-indigo-600 hover:text-indigo-700'}
                      transition-all duration-300
                    `}
                  >
                    <span className="mr-2 group-hover:mr-3 transition-all">
                      Explore Course
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

export default DsaCard;