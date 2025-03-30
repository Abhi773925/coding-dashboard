import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight, Trophy, Star, Award, UserCheck, Sparkles, Gift, BarChart4, ArrowRight } from 'lucide-react';
import axios from 'axios';

const testimonials = [
  {
    id: 1,
    name: "Alex Rodriguez",
    achievement: "100 Days of Coding Challenge",
    quote: "CodingKaro transformed my learning journey from zero to building real-world projects.",
    details: "Completed 500+ coding hours",
    program: "Beginner to Professional Track",
    skills: ["JavaScript", "React", "Node.js"],
    profileImage: "/api/placeholder/150/150", // Placeholder for profile image
    color: "indigo"
  },
  {
    id: 2,
    name: "Maya Chen",
    achievement: "Full Stack Development",
    quote: "The structured learning path helped me become a confident full-stack developer.",
    details: "Built 10 production projects",
    program: "Advanced Coding Bootcamp",
    skills: ["Python", "Django", "React", "MongoDB"],
    profileImage: "/api/placeholder/150/150",
    color: "emerald"
  },
  {
    id: 3,
    name: "Jordan Kim",
    achievement: "Open Source Contributor",
    quote: "Learned not just coding, but how to collaborate and make a real impact.",
    details: "50+ Pull Requests Merged",
    program: "Community Coding Program",
    skills: ["TypeScript", "GraphQL", "Docker"],
    profileImage: "/api/placeholder/150/150",
    color: "purple"
  }
];

const StreakTracker = ({ isDarkMode }) => {
  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // Configure axios base URL for backend
  axios.defaults.baseURL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          throw new Error('No user email found');
        }

        const response = await axios.get('/streak', {
          params: { email: userEmail }
        });

        setStreak(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  const handleUpdateStreak = async () => {
    try {
      setShowAnimation(true);
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('No user email found');
      }

      const response = await axios.post('/streak/update', { 
        email: userEmail 
      });

      setStreak(response.data);
      setTimeout(() => setShowAnimation(false), 1500);
    } catch (err) {
      setError(err.message);
      setShowAnimation(false);
    }
  };

  if (loading) return (
    <div 
      className={`
        w-full p-4 rounded-lg animate-pulse
        ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'}
      `}
    >
      <div className="h-6 w-3/4 mb-4 rounded bg-gradient-to-r from-gray-800 to-gray-700"></div>
      <div className="h-12 w-1/2 mb-4 rounded bg-gradient-to-r from-gray-800 to-gray-700"></div>
      <div className="h-8 w-full rounded bg-gradient-to-r from-gray-800 to-gray-700"></div>
    </div>
  );

  if (error) return (
    <div 
      className={`
        w-full p-4 rounded-lg
        ${isDarkMode 
          ? 'bg-red-900/30 text-red-300 backdrop-blur-sm border border-red-800' 
          : 'bg-red-100 text-red-800 border border-red-200'}
      `}
    >
      Error: {error}
    </div>
  );

  return (
    <div 
      className={`
        w-full rounded-xl overflow-hidden
        ${isDarkMode 
          ? 'bg-zinc-800 border-2 border-zinc-700 hover:border-zinc-600' 
          : 'bg-white border-2 border-gray-200 hover:border-gray-300'}
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
        relative
      `}
    >
      {/* Animated Gradient Background */}
      <div 
        className={`
          absolute inset-0 opacity-10 hover:opacity-30
          bg-gradient-to-br from-indigo-600 to-purple-600
          transition-all duration-500
        `}
      />

      <div 
        className={`
          px-4 py-3 flex items-center justify-between relative z-30
          ${isDarkMode 
            ? 'bg-zinc-800 border-b border-zinc-700' 
            : 'bg-gray-50 border-b border-gray-200'}
        `}
      >
        <h2 
          className={`
            text-lg font-bold flex items-center
            ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}
          `}
        >
          <Award 
            className={`
              h-5 w-5 mr-2
              ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
            `}
          />
          Coding Progress
        </h2>
        <div className="flex items-center space-x-2">
          <BarChart4 
            className={`
              h-5 w-5
              ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
            `}
          />
          <UserCheck 
            className={`
              h-5 w-5
              ${isDarkMode ? 'text-green-400' : 'text-green-600'}
            `}
          />
        </div>
      </div>
      <div className="p-6 relative z-30">
        <div 
          className={`
            flex justify-between items-center mb-6 p-4 rounded-lg
            ${isDarkMode 
              ? 'bg-zinc-900/50 border border-zinc-700' 
              : 'bg-gray-50 border border-gray-200 shadow-sm'}
          `}
        >
          <div>
            <p 
              className={`
                text-sm mb-2
                ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}
              `}
            >
              Current Streak
            </p>
            <div className="flex items-center">
              <Star 
                className={`
                  h-5 w-5 mr-2
                  ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
                  ${showAnimation ? 'animate-pulse' : ''}
                `}
              />
              <span 
                className={`
                  text-xl font-bold
                  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}
                  ${showAnimation ? 'animate-bounce' : ''}
                `}
              >
                {streak.currentStreak} days
              </span>
            </div>
          </div>
          <div>
            <p 
              className={`
                text-sm mb-2
                ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}
              `}
            >
              Longest Streak
            </p>
            <div className="flex items-center">
              <Trophy 
                className={`
                  h-5 w-5 mr-2
                  ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}
                `}
              />
              <span 
                className={`
                  text-xl font-bold
                  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}
                `}
              >
                {streak.longestStreak} days
              </span>
            </div>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div 
            className={`
              h-3 w-full rounded-full overflow-hidden
              ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}
            `}
          >
            <div 
              style={{ width: `${Math.min(100, (streak.currentStreak / (streak.longestStreak || 1)) * 100)}%` }}
              className={`
                h-full rounded-full 
                ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'}
                transition-all duration-700 ease-in-out
              `}
            ></div>
          </div>
          <div className="mt-2 flex justify-between">
            <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Progress</span>
            <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
              {Math.round((streak.currentStreak / (streak.longestStreak || 1)) * 100)}%
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleUpdateStreak}
          className={`
            w-full py-3 rounded-lg transition-all duration-300 flex items-center justify-center
            relative overflow-hidden group
            ${isDarkMode
              ? 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'}
          `}
        >
          {showAnimation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
          <div className={`flex items-center justify-center ${showAnimation ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
            <Star className="h-5 w-5 mr-2 group-hover:rotate-45 transition-transform duration-300" />
            <span className="group-hover:translate-x-1 transition-transform duration-300">Log Today's Coding</span>
          </div>
          <span 
            className={`
              absolute bottom-0 left-0 h-1 bg-white/30
              transform scale-x-0 group-hover:scale-x-100
              origin-left transition-transform duration-500
            `}
          ></span>
        </button>

        <div 
          className={`
            mt-4 p-3 rounded-lg text-sm flex items-center
            ${isDarkMode 
              ? 'bg-green-900/20 text-green-400 border border-green-900/30' 
              : 'bg-green-50 text-green-700 border border-green-100'}
          `}
        >
          <Gift className="h-4 w-4 mr-2" />
          <span>Earn rewards at 7, 30, and 100 day streaks!</span>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDarkMode } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % testimonials.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div
      className={`
        ${isDarkMode
          ? 'bg-zinc-950 text-gray-100'
          : 'bg-white text-gray-900'}
        min-h-screen flex items-center justify-center 
        px-4 py-16 transition-colors duration-300
        relative
      `}
    >
      <div className="max-w-7xl w-full max-h-fit mx-auto">
        {/* Improved Title section with subtle animation */}
        <div className="text-center mb-16 relative">
          <h2 
            className={`
              text-4xl font-bold
              bg-clip-text text-transparent
              ${isDarkMode 
                ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500' 
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'}
            `}
          >
            Success Stories
          </h2>
          <div className="mt-2 max-w-2xl mx-auto">
            <p className={`text-lg ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              See how our community members have transformed their coding journey
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full bg-indigo-500/10 animate-pulse"></div>
          <div className="absolute top-0 right-1/3 w-6 h-6 rounded-full bg-purple-500/10 animate-pulse"></div>
        </div>

        {/* NEW LAYOUT: Main two column flex instead of grid for better control */}
        <div className="flex flex-col min-h-fit lg:flex-row gap-8 items-stretch">
          {/* Featured Testimonial - Left Column (larger) */}
          <div className="lg:w-2/3">
            <div 
              className={`
                relative overflow-hidden rounded-3xl h-full
                transform transition-all duration-500 ease-in-out
                border-2 group
                ${isDarkMode 
                  ? `bg-zinc-800 border-zinc-700 hover:border-zinc-600` 
                  : `bg-white border-gray-200 hover:border-gray-300`}
                shadow-lg hover:shadow-2xl
              `}
            >
              {/* Background gradient */}
              <div 
                className={`
                  absolute inset-0 opacity-10 group-hover:opacity-20
                  bg-gradient-to-br 
                  ${
                    testimonials[currentIndex].color === 'indigo' 
                      ? 'from-indigo-600 to-purple-600' 
                    : testimonials[currentIndex].color === 'emerald'
                      ? 'from-emerald-600 to-teal-600'
                    : 'from-purple-600 to-pink-600'
                  }
                  transition-all duration-500
                `}
              />

              <div className="p-8 relative z-20">
                {/* Header with more prominent image */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                  {/* Larger profile image */}
                  <div 
                    className={`
                      w-24 h-24 rounded-full flex items-center justify-center relative
                      ${
                        testimonials[currentIndex].color === 'indigo' 
                          ? (isDarkMode 
                              ? 'bg-indigo-900/40 text-indigo-400' 
                              : 'bg-indigo-100 text-indigo-600')
                        : testimonials[currentIndex].color === 'emerald'
                          ? (isDarkMode 
                              ? 'bg-emerald-900/40 text-emerald-400' 
                              : 'bg-emerald-100 text-emerald-600')
                        : (isDarkMode 
                            ? 'bg-purple-900/40 text-purple-400' 
                            : 'bg-purple-100 text-purple-600')
                      }
                      shadow-lg group-hover:shadow-xl
                      transition-transform duration-500
                      group-hover:scale-105
                    `}
                  >
                    <img 
                      src={testimonials[currentIndex].profileImage} 
                      alt={testimonials[currentIndex].name} 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>

                  <div>
                    {/* Name and details with better hierarchy */}
                    <h3 
                      className={`
                        text-3xl font-bold mb-2
                        ${isDarkMode ? 'text-white' : 'text-gray-900'}
                      `}
                    >
                      {testimonials[currentIndex].name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span 
                        className={`
                          px-3 py-1 rounded-full text-sm font-medium inline-flex items-center
                          ${
                            testimonials[currentIndex].color === 'indigo' 
                              ? (isDarkMode 
                                  ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-800' 
                                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200')
                              : testimonials[currentIndex].color === 'emerald'
                                ? (isDarkMode 
                                    ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' 
                                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200')
                                : (isDarkMode 
                                    ? 'bg-purple-900/40 text-purple-300 border border-purple-800' 
                                    : 'bg-purple-100 text-purple-700 border border-purple-200')
                          }
                        `}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        {testimonials[currentIndex].achievement}
                      </span>
                      
                      <span 
                        className={`
                          px-3 py-1 rounded-full text-sm inline-flex items-center
                          ${isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-gray-100 text-gray-600'}
                        `}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {testimonials[currentIndex].details}
                      </span>
                    </div>
                    
                    <span 
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${
                          testimonials[currentIndex].color === 'indigo' 
                            ? (isDarkMode 
                                ? 'bg-indigo-900/30 text-indigo-300' 
                                : 'bg-indigo-100 text-indigo-600')
                            : testimonials[currentIndex].color === 'emerald'
                              ? (isDarkMode 
                                  ? 'bg-emerald-900/30 text-emerald-300' 
                                  : 'bg-emerald-100 text-emerald-600')
                              : (isDarkMode 
                                  ? 'bg-purple-900/30 text-purple-300' 
                                  : 'bg-purple-100 text-purple-600')
                        }
                      `}
                    >
                      {testimonials[currentIndex].program}
                    </span>
                  </div>
                </div>

                {/* Quote with better visual treatment */}
                <blockquote
                  className={`
                    text-xl italic mb-8 p-6 relative
                    ${isDarkMode 
                      ? 'text-white bg-zinc-900/50 rounded-xl border border-zinc-800' 
                      : 'text-gray-700 bg-gray-50 rounded-xl border border-gray-200'}
                  `}
                >
                  <div className="absolute top-0 left-0 transform -translate-x-2 -translate-y-2 text-4xl opacity-30">
                    "
                  </div>
                  {testimonials[currentIndex].quote}
                  <div className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2 text-4xl opacity-30">
                    "
                  </div>
                </blockquote>
                
                {/* Skills with improved spacing */}
                <div>
                  <div className={`text-sm mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                    Tech Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {testimonials[currentIndex].skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className={`
                          px-3 py-1.5 rounded-lg text-sm font-medium
                          ${
                            testimonials[currentIndex].color === 'indigo' 
                              ? (isDarkMode 
                                  ? 'bg-indigo-900/30 text-indigo-300' 
                                  : 'bg-indigo-100 text-indigo-600')
                            : testimonials[currentIndex].color === 'emerald'
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
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (smaller) - Stack Streak Tracker and Navigation */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            {/* Streak Tracker - Top */}
            <div className="flex-grow">
              <StreakTracker isDarkMode={isDarkMode} />
            </div>

            {/* Navigation Controls - Bottom */}
            <div 
              className={`
                p-6 rounded-2xl relative
                ${isDarkMode 
                  ? 'bg-zinc-800 border-2 border-zinc-700' 
                  : 'bg-white border-2 border-gray-200'}
              `}
            >
              <div className="text-center mb-4">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Browse Stories
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                  Explore success stories from our community
                </p>
              </div>
              
              {/* Thumbnail navigation */}
              <div className="flex flex-col gap-3 mb-6">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true);
                        setCurrentIndex(index);
                        setTimeout(() => setIsAnimating(false), 500);
                      }
                    }}
                    className={`
                      flex items-center p-3 rounded-lg transition-all duration-300
                      ${currentIndex === index 
                        ? (isDarkMode 
                            ? `bg-${testimonial.color}-900/30 border border-${testimonial.color}-800`
                            : `bg-${testimonial.color}-50 border border-${testimonial.color}-200`)
                        : (isDarkMode
                            ? 'bg-zinc-900/30 border border-zinc-800 hover:bg-zinc-900/50'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100')}
                    `}
                  >
                    <div 
                      className={`
                        w-10 h-10 rounded-full mr-3 flex-shrink-0 overflow-hidden
                        border-2
                        ${currentIndex === index 
                          ? (isDarkMode 
                              ? `border-${testimonial.color}-400`
                              : `border-${testimonial.color}-500`)
                          : (isDarkMode
                              ? 'border-zinc-700'
                              : 'border-gray-300')}
                      `}
                    >
                      <img 
                        src={testimonial.profileImage} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {testimonial.name}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                        {testimonial.program}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Arrow navigation */}
              <div className="flex justify-between">
                <button 
                  onClick={handlePrev}
                  disabled={isAnimating}
                  className={`
                    p-3 rounded-lg flex items-center transition-all duration-300
                    ${isDarkMode
                      ? 'bg-zinc-900 text-zinc-400 hover:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 hover:text-indigo-600 hover:bg-gray-200'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  <span>Previous</span>
                </button>
                <button 
                  onClick={handleNext}
                  disabled={isAnimating}
                  className={`
                    p-3 rounded-lg flex items-center transition-all duration-300
                    ${isDarkMode
                      ? 'bg-zinc-900 text-zinc-400 hover:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 hover:text-indigo-600 hover:bg-gray-200'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  aria-label="Next Testimonial"
                >
                  <span>Next</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
              
              {/* View All Button */}
              <div className="mt-6">
                <button 
                  className={`
                    w-full flex items-center justify-center px-6 py-3 rounded-lg group
                    ${isDarkMode
                      ? 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                    transition-all duration-300
                  `}
                >
                  <span className="mr-2 group-hover:mr-3 transition-all">
                    View All Success Stories
                  </span>
                  <ArrowRight 
                    className="transform transition-transform group-hover:translate-x-1" 
                    size={18}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;