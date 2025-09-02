"use client"

import React, { useState, createContext, useContext, useRef, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { useNavigate } from "react-router-dom"
import { Code, Server, Briefcase, ArrowRight, FileCode } from "lucide-react"
import { motion } from "framer-motion"

// 3D Card Components
const MouseEnterContext = createContext(undefined);

const CardContainer = ({ children, className, containerClassName }) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = (e) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = (e) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={`${containerClassName} flex items-center justify-center`}
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`${className} flex items-center justify-center relative transition-all duration-200 ease-linear`}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

const CardBody = ({ children, className }) => {
  return (
    <div
      className={`w-full max-w-sm h-auto [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  );
};

const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const ref = useRef(null);
  const [isMouseEntered] = useContext(MouseEnterContext);

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <Tag
      ref={ref}
      className={`${className} w-fit transition duration-200 ease-linear`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

const courseData = [
  {
    title: "SDE Striver Sheet",
    description: "Comprehensive DSA preparation course by Striver for Software Engineering roles",
    level: "Intermediate",
    icon: <Code />,
    color: "indigo",
    skills: ["Arrays", "Graphs", "DP", "Trees", "180+ Problems"],
    route: "/courses/data-structures",
  },
  {
    title: "Love Babbar DSA Sheet",
    description: "Complete DSA course covering all essential topics for coding interviews",
    level: "All Levels",
    icon: <Briefcase />,
    color: "blue",
    skills: ["450 Problems", "Arrays", "Strings", "Recursion", "DP"],
    route: "/courses/lovebabbar",
  }, 
  
  {
    title: "Technical Interview Preparation",
    description: "Strategies and practice for acing technical interviews",
    level: "Advanced",
    icon: <Server />,
    color: "indigo",
    skills: ["Problem Solving", "Algorithmic Thinking", "Mock Interviews"],
    route: "/courses/interview-prep",
  },
]

const DsaCard = () => {
  const { isDarkMode, schemes } = useTheme()
  const navigate = useNavigate()

  const handleExplore = (route) => {
    navigate(route)
  }

  // Helper function to get accent colors based on theme and course color - simplified like HeroSection
  const getAccentColor = (baseColor, type) => {
    // Simplified color system matching HeroSection approach
    const colorVariants = {
      indigo: isDarkMode ? "text-indigo-400" : "text-indigo-600",
      blue: isDarkMode ? "text-blue-400" : "text-blue-600", 
      zinc: isDarkMode ? "text-zinc-400" : "text-zinc-600",
    }

    const bgVariants = {
      indigo: isDarkMode ? "bg-indigo-900/30" : "bg-indigo-100",
      blue: isDarkMode ? "bg-blue-900/30" : "bg-blue-100",
      zinc: isDarkMode ? "bg-zinc-900/30" : "bg-zinc-100",
    }

    const gradientVariants = {
      indigo: isDarkMode ? "from-indigo-400 to-blue-400" : "from-indigo-600 to-blue-600",
      blue: isDarkMode ? "from-blue-400 to-indigo-400" : "from-blue-600 to-indigo-600",
      zinc: isDarkMode ? "from-zinc-400 to-gray-400" : "from-zinc-600 to-gray-600",
    }

    switch (type) {
      case "text":
        return colorVariants[baseColor] || colorVariants.indigo
      case "bg":
        return bgVariants[baseColor] || bgVariants.indigo
      case "gradient":
        return gradientVariants[baseColor] || gradientVariants.indigo
      default:
        return colorVariants[baseColor] || colorVariants.indigo
    }
  }

  return (
    <div
      className={`
        min-h-screen py-24 px-4 sm:px-6 lg:px-8
        ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}
        transition-colors duration-300
      `}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`
            text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-16
            ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}
          `}
        >
          DSA Practice Sheets
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseData.map((course, index) => (
            <CardContainer key={index} className="inter-var w-full">
              <CardBody
                className={`
                  relative group/card w-full h-auto rounded-xl p-6 border
                  ${isDarkMode 
                    ? "bg-neutral-900 border-neutral-800 hover:bg-neutral-800" 
                    : "bg-neutral-100 border-neutral-200 hover:bg-white hover:shadow-lg"
                  }
                  transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                `}
              >
                {/* Icon Container */}
                <CardItem
                  translateZ="50"
                  className={`
                    mb-4 w-14 h-14 rounded-full flex items-center justify-center
                    ${getAccentColor(course.color, "bg")}
                    ${getAccentColor(course.color, "text")}
                    transition-transform duration-500
                  `}
                >
                  {React.cloneElement(course.icon, {
                    size: 28,
                    strokeWidth: 1.5,
                  })}
                </CardItem>

                {/* Course Title */}
                <CardItem
                  translateZ="50"
                  className={`
                    text-lg font-bold mb-3
                    ${isDarkMode ? "text-slate-300" : "text-slate-700"}
                  `}
                >
                  {course.title}
                </CardItem>

                {/* Course Description */}
                <CardItem
                  as="p"
                  translateZ="60"
                  className={`
                    mb-4 text-sm
                    ${isDarkMode ? "text-slate-300" : "text-slate-700"}
                  `}
                >
                  {course.description}
                </CardItem>

                {/* Skills Tags */}
                <CardItem translateZ="70" className="w-full mb-6">
                  <div className="flex flex-wrap gap-1.5">
                    {course.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${getAccentColor(course.color, "bg")}
                          ${getAccentColor(course.color, "text")}
                        `}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardItem>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto">
                  <CardItem
                    translateZ={20}
                    className={`
                      px-2.5 py-1 rounded-full text-xs font-medium
                      ${getAccentColor(course.color, "bg")}
                      ${getAccentColor(course.color, "text")}
                    `}
                  >
                    {course.level}
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="button"
                    onClick={() => handleExplore(course.route)}
                    className={`
                      flex items-center group px-3 py-1.5 rounded-lg font-semibold text-xs
                      transition-all duration-300 transform hover:scale-105
                      ${isDarkMode 
                        ? 'bg-white text-black hover:bg-gray-200' 
                        : 'bg-zinc-900 text-slate-300 hover:bg-zinc-900'
                      }
                    `}
                  >
                    <span className="mr-1 group-hover:mr-2 transition-all">Explore</span>
                    <ArrowRight
                      className="transform transition-transform group-hover:translate-x-1"
                      size={14}
                    />
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DsaCard
