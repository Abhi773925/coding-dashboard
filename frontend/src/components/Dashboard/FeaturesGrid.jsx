import React from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Code, Users, Layers, Rocket, Star, LineChart, Cpu, Server } from "lucide-react";

// This is a compact version of the Features component that shows all features in a grid layout
// It reuses the feature data from the main Features component

const featuresData = [
  {
    id: 1,
    name: "Interactive Coding Environment",
    description: "Write, run, and debug code in 40+ programming languages with our powerful online compiler.",
    icon: <Code className="h-6 w-6" />,
    color: "blue",
  },
  {
    id: 2,
    name: "Live Collaboration",
    description: "Collaborate on code in real-time with peers, mentors, or instructors using our shared workspace.",
    icon: <Users className="h-6 w-6" />,
    color: "green",
  },
  {
    id: 3,
    name: "Algorithm Visualization",
    description: "Visualize complex algorithms and data structures to understand their inner workings.",
    icon: <Layers className="h-6 w-6" />,
    color: "indigo",
  },
  {
    id: 4,
    name: "Competitive Programming",
    description: "Practice and compete with coding challenges from popular platforms like LeetCode, CodeChef, and Codeforces.",
    icon: <Rocket className="h-6 w-6" />,
    color: "purple",
  },
  {
    id: 5,
    name: "Interview Preparation",
    description: "Get ready for technical interviews with specialized courses and mock interview sessions.",
    icon: <Star className="h-6 w-6" />,
    color: "amber",
  },
  {
    id: 6,
    name: "Performance Analytics",
    description: "Track your learning progress, identify strengths and weaknesses, and optimize your study plan.",
    icon: <LineChart className="h-6 w-6" />,
    color: "cyan",
  },
  {
    id: 7,
    name: "Comprehensive Courses",
    description: "Learn from structured courses covering everything from programming basics to advanced topics.",
    icon: <Cpu className="h-6 w-6" />,
    color: "emerald",
  },
  {
    id: 8,
    name: "Backend Integration",
    description: "Connect your frontend to powerful backend services with seamless API integration.",
    icon: <Server className="h-6 w-6" />,
    color: "rose",
  }
];

const FeaturesGrid = () => {
  const { isDarkMode } = useTheme();
  
  const getColorClasses = (color, type) => {
    const colors = {
      blue: {
        bg: isDarkMode ? "bg-blue-900/20" : "bg-blue-100",
        text: isDarkMode ? "text-blue-300" : "text-blue-700",
        border: isDarkMode ? "border-blue-800" : "border-blue-200",
        gradient: "from-blue-600 to-cyan-600",
      },
      green: {
        bg: isDarkMode ? "bg-green-900/20" : "bg-green-100",
        text: isDarkMode ? "text-green-300" : "text-green-700",
        border: isDarkMode ? "border-green-800" : "border-green-200",
        gradient: "from-green-600 to-emerald-600",
      },
      indigo: {
        bg: isDarkMode ? "bg-indigo-900/20" : "bg-indigo-100",
        text: isDarkMode ? "text-indigo-300" : "text-indigo-700",
        border: isDarkMode ? "border-indigo-800" : "border-indigo-200",
        gradient: "from-indigo-600 to-blue-600",
      },
      purple: {
        bg: isDarkMode ? "bg-purple-900/20" : "bg-purple-100",
        text: isDarkMode ? "text-purple-300" : "text-purple-700",
        border: isDarkMode ? "border-purple-800" : "border-purple-200",
        gradient: "from-purple-600 to-indigo-600",
      },
      amber: {
        bg: isDarkMode ? "bg-amber-900/20" : "bg-amber-100",
        text: isDarkMode ? "text-amber-300" : "text-amber-700",
        border: isDarkMode ? "border-amber-800" : "border-amber-200",
        gradient: "from-amber-600 to-orange-600",
      },
      cyan: {
        bg: isDarkMode ? "bg-cyan-900/20" : "bg-cyan-100",
        text: isDarkMode ? "text-cyan-300" : "text-cyan-700",
        border: isDarkMode ? "border-cyan-800" : "border-cyan-200",
        gradient: "from-cyan-600 to-blue-600",
      },
      emerald: {
        bg: isDarkMode ? "bg-emerald-900/20" : "bg-emerald-100",
        text: isDarkMode ? "text-emerald-300" : "text-emerald-700",
        border: isDarkMode ? "border-emerald-800" : "border-emerald-200",
        gradient: "from-emerald-600 to-green-600",
      },
      rose: {
        bg: isDarkMode ? "bg-rose-900/20" : "bg-rose-100",
        text: isDarkMode ? "text-rose-300" : "text-rose-700",
        border: isDarkMode ? "border-rose-800" : "border-rose-200",
        gradient: "from-rose-600 to-pink-600",
      }
    };
    return colors[color]?.[type] || "";
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      }
    },
  };

  return (
    <section className={`py-16 px-4 ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className={`text-3xl sm:text-4xl font-bold mb-4 ${
              isDarkMode 
                ? "bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent" 
                : "bg-gradient-to-r from-green-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent"
            }`}
          >
            Platform Features
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            Everything you need to learn, practice, and excel in coding
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {featuresData.map((feature) => (
            <motion.div
              key={feature.id}
              className={`
                relative p-6 rounded-xl border transition-all duration-300
                ${isDarkMode 
                  ? `bg-slate-800/70 border-slate-700 hover:border-${feature.color}-500/40` 
                  : `bg-white hover:border-${feature.color}-500/40 border-gray-200`
                }
                hover:shadow-lg group
              `}
              variants={itemVariants}
            >
              {/* Hover gradient background */}
              <div className={`
                absolute inset-0 rounded-xl opacity-0 group-hover:opacity-5 
                transition-opacity duration-500 
                bg-gradient-to-br ${getColorClasses(feature.color, "gradient")}
              `}/>
              
              <div className={`
                w-14 h-14 flex items-center justify-center rounded-full mb-4
                ${getColorClasses(feature.color, "bg")}
              `}>
                <div className={getColorClasses(feature.color, "text")}>
                  {feature.icon}
                </div>
              </div>
              
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {feature.name}
              </h3>
              
              <p className={`${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;