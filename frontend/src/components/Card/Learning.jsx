import React, { useState } from 'react';
import { useTheme } from "../context/ThemeContext";
import { Code, BookOpen, Github, Cpu, Globe, Award, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Learning = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('dsa');
  const [expandedSections, setExpandedSections] = useState({
    dsa: [0],
    webdev: [0],
    career: [0]
  });
  
  const toggleSection = (path, index) => {
    setExpandedSections(prev => {
      const newExpanded = {...prev};
      if (newExpanded[path].includes(index)) {
        newExpanded[path] = newExpanded[path].filter(i => i !== index);
      } else {
        newExpanded[path] = [...newExpanded[path], index];
      }
      return newExpanded;
    });
  };
  
  // Learning paths data
  const paths = {
    dsa: [
      {
        title: "Phase 1: Programming Fundamentals (4-6 weeks)",
        icon: <Code size={18} />,
        content: [
          "Choose a language: JavaScript, Python, or Java",
          "Core concepts: Variables, data types, operators, loops, conditionals",
          "Functions and scope: Parameters, return values, closures",
          "Object-oriented programming basics",
          "Practice: 30-50 basic programming challenges"
        ]
      },
      {
        title: "Phase 2: Basic Data Structures (6-8 weeks)",
        icon: <Cpu size={18} />,
        content: [
          "Arrays and Strings: Manipulation techniques, common patterns",
          "Linked Lists: Singly and doubly linked lists, operations",
          "Stacks and Queues: Implementation and applications",
          "Hash Tables/Maps: Hash functions, collision handling",
          "Trees: Binary trees, BST, tree traversals",
          "Heaps: Min/max heaps, priority queues"
        ]
      },
      {
        title: "Phase 3: Basic Algorithms (4-6 weeks)",
        icon: <Cpu size={18} />,
        content: [
          "Searching: Linear search, binary search",
          "Sorting: Bubble, selection, insertion, merge, quick sort",
          "Recursion: Base cases, recursive thinking",
          "Time & Space Complexity: Big O notation",
          "Problem Solving Patterns: Two pointers, sliding window, frequency counter"
        ]
      },
      {
        title: "Phase 4: Advanced DSA (8-10 weeks)",
        icon: <Cpu size={18} />,
        content: [
          "Graphs: Representation, traversals (BFS/DFS), shortest path algorithms",
          "Dynamic Programming: Memoization, tabulation",
          "Greedy Algorithms: Interval scheduling, activity selection",
          "Backtracking: N-Queens, combination problems",
          "Trie and Advanced Tree Structures",
          "Advanced problems from LeetCode, HackerRank, CodeForces"
        ]
      }
    ],
    webdev: [
      {
        title: "Phase 1: Frontend Basics (6-8 weeks)",
        icon: <Globe size={18} />,
        content: [
          "HTML5: Semantic elements, forms, validation",
          "CSS3: Selectors, box model, flexbox, grid, responsive design",
          "JavaScript Fundamentals: DOM manipulation, events, AJAX",
          "Build 3-5 static websites from scratch"
        ]
      },
      {
        title: "Phase 2: Frontend Frameworks (8-10 weeks)",
        icon: <Globe size={18} />,
        content: [
          "Choose a framework: React (recommended), Vue, or Angular",
          "Components, props, state management",
          "Routing and navigation",
          "Hooks (React) or equivalent concepts",
          "API integration, fetch/axios",
          "Build 2-3 dynamic web applications"
        ]
      },
      {
        title: "Phase 3: Backend Development (8-10 weeks)",
        icon: <Globe size={18} />,
        content: [
          "Choose a backend: Node.js+Express, Django, Ruby on Rails",
          "Server-side programming fundamentals",
          "RESTful API design and implementation",
          "Database integration: SQL (PostgreSQL/MySQL) or NoSQL (MongoDB)",
          "Authentication & Authorization: JWT, OAuth",
          "Build a complete backend API for one of your frontend projects"
        ]
      },
      {
        title: "Phase 4: Full Stack & DevOps (6-8 weeks)",
        icon: <Globe size={18} />,
        content: [
          "Connect frontend and backend applications",
          "Deployment: Heroku, Vercel, Netlify, AWS",
          "CI/CD basics: GitHub Actions or similar",
          "Performance optimization techniques",
          "Security best practices",
          "Build and deploy 1-2 complete full-stack applications"
        ]
      }
    ],
    career: [
      {
        title: "Phase 1: Portfolio Building (4-6 weeks)",
        icon: <Github size={18} />,
        content: [
          "Create a professional GitHub profile",
          "Build a personal portfolio website",
          "Document all projects with detailed READMEs",
          "Contribute to open-source projects"
        ]
      },
      {
        title: "Phase 2: Interview Preparation (6-8 weeks)",
        icon: <Github size={18} />,
        content: [
          "DSA practice: Solve 100+ medium-level problems",
          "System design basics",
          "Behavioral interview preparation",
          "Mock interviews with peers or platforms like Pramp"
        ]
      },
      {
        title: "Phase 3: Job Application Strategy (ongoing)",
        icon: <Github size={18} />,
        content: [
          "Resume and LinkedIn optimization",
          "Networking: Tech meetups, conferences, online communities",
          "Application tracking system",
          "Negotiation strategies",
          "Continuous learning plan"
        ]
      }
    ]
  };
  
  // Resources data
  const resources = [
    {
      title: "DSA Resources",
      icon: <Cpu size={20} />,
      items: [
        "LeetCode, HackerRank, AlgoExpert",
        "\"Cracking the Coding Interview\" book",
        "Grokking Algorithms book",
        "CodingKaro DSA Foundation course"
      ]
    },
    {
      title: "Web Dev Resources",
      icon: <Globe size={20} />,
      items: [
        "MDN Web Docs",
        "freeCodeCamp, The Odin Project",
        "Frontend Mentor challenges",
        "CodingKaro Full Stack Bootcamp"
      ]
    },
    {
      title: "Career Resources",
      icon: <Award size={20} />,
      items: [
        "Tech interview handbook",
        "Pramp for mock interviews",
        "CodingKaro Career Prep workshop",
        "GitHub Student Developer Pack"
      ]
    }
  ];
  
  return (
    <div className={`w-full pt-12 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Your <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Learning</span> Path
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
            Follow our structured learning paths to master programming skills and prepare for your tech career.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-10 gap-2">
          {[
            { id: 'dsa', label: 'Data Structures & Algorithms', icon: <Cpu className="mr-2" /> },
            { id: 'webdev', label: 'Web Development', icon: <Globe className="mr-2" /> },
            { id: 'career', label: 'Career Preparation', icon: <Award className="mr-2" /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                activeTab === tab.id 
                  ? isDarkMode 
                    ? 'bg-indigo-900/50 text-indigo-300 shadow-lg shadow-indigo-900/30'
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : isDarkMode 
                    ? 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800/80'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          {paths[activeTab].map((section, sectionIndex) => (
            <div 
              key={sectionIndex} 
              className={`border rounded-xl overflow-hidden transition-all duration-300 transform hover:translate-y-[-2px] ${
                isDarkMode 
                  ? 'border-zinc-800 bg-zinc-900 shadow-xl shadow-black/40' 
                  : 'border-gray-200 bg-white shadow-xl shadow-indigo-100/40'
              }`}
            >
              <div 
                className={`flex justify-between items-center p-5 cursor-pointer ${
                  isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleSection(activeTab, sectionIndex)}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 mr-3 p-2 rounded-lg ${
                    isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {section.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                </div>
                <span>
                  {expandedSections[activeTab].includes(sectionIndex) 
                    ? <ChevronUp className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} /> 
                    : <ChevronDown className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />}
                </span>
              </div>
              
              {expandedSections[activeTab].includes(sectionIndex) && (
                <div className={`p-5 border-t ${isDarkMode ? 'border-zinc-800 bg-zinc-900/70' : 'border-gray-100 bg-gray-50/70'}`}>
                  <ul className={`space-y-3 ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className={`flex-shrink-0 mr-2 mt-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Resources section */}
        <div className={`mt-12 rounded-2xl overflow-hidden ${
          isDarkMode ? 'bg-black shadow-2xl shadow-indigo' : 'bg-indigo-50 shadow-2xl shadow-indigo-100/50'
        }`}>
          <div className="p-6">
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
            }`}>
              Recommended Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource, i) => (
                <div 
                  key={i} 
                  className={`p-5 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] ${
                    isDarkMode 
                      ? 'bg-zinc-900 hover:bg-zinc-800 shadow-lg shadow-black/30' 
                      : 'bg-white hover:bg-gray-50 shadow-lg shadow-gray-200/80'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-lg mr-3 ${
                      isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {resource.icon}
                    </div>
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
                    }`}>
                      {resource.title}
                    </h3>
                  </div>
                  <ul className={`space-y-2 ${
                    isDarkMode ? 'text-zinc-300' : 'text-gray-700'
                  }`}>
                    {resource.items.map((item, j) => (
                      <li key={j} className="flex items-start">
                        <span className={`flex-shrink-0 mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Progress tracker */}
        <div className={`mt-12 rounded-2xl overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-br from-black-900 to-black-800 shadow-2xl shadow-black/30' 
            : 'bg-gradient-to-br from-white to-gray-50 shadow-2xl shadow-gray-200/80'
        }`}>
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="md:w-2/3">
                <h2 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
                }`}>
                  Track Your Progress
                </h2>
                <p className={`mb-4 ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
                  Sign up or log in to track your progress through the learning path. CodingKaro members get access to:
                </p>
                <ul className={`space-y-3 mb-6 ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
                  <li className="flex items-center">
                    <div className={`flex-shrink-0 p-1 rounded-full mr-3 ${
                      isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      <Check size={16} />
                    </div>
                    Personalized learning dashboard
                  </li>
                  <li className="flex items-center">
                    <div className={`flex-shrink-0 p-1 rounded-full mr-3 ${
                      isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      <Check size={16} />
                    </div>
                    Project reviews from mentors
                  </li>
                  <li className="flex items-center">
                    <div className={`flex-shrink-0 p-1 rounded-full mr-3 ${
                      isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      <Check size={16} />
                    </div>
                    Completion certificates
                  </li>
                </ul>
              </div>
              
              <div className="md:w-1/3 flex justify-center">
                <Link 
                  to="/allcourse" 
                  className={`
                    flex items-center justify-center 
                    px-8 py-4 rounded-full text-lg font-medium 
                    transition-all duration-300 transform hover:scale-105
                    shadow-xl
                    ${isDarkMode
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/10'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/40'
                    }
                  `}
                >
                  <BookOpen className="mr-2 text-red-400" />
                  
<p class="bg-clip-text bg-gradient-to-r from-green-1000 via-white to-red-400 font-bold text-lg">
 Join Now
</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;