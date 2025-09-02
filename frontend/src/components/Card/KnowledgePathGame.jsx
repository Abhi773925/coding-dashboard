import React, { useState, useEffect, useRef, useContext } from 'react';
import { Lightbulb, Star, Trophy, Moon, Sun, Check, X, Info, FileCheck, RotateCcw, Award, ArrowRight, Play, PauseCircle } from 'lucide-react';

// Create a proper Theme Context
const ThemeContext = React.createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  // Check if dark mode preference exists in localStorage, or use system preference
  const prefersDark = 
    typeof window !== 'undefined' && 
    (localStorage.getItem('darkMode') === 'true' || 
    (localStorage.getItem('darkMode') === null && 
      window.matchMedia('(prefers-color-scheme: dark)').matches));
  
  const [darkMode, setDarkMode] = useState(prefersDark);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Sample card data for the game levels
const levelData = [
  {
    id: 1,
    title: "Flexbox Basics",
    description: "Learn the core concepts of flexbox layout",
    level: "Beginner",
    icon: <Lightbulb />,
    color: "indigo",
    objective: "Match the target layout by selecting the correct flexbox properties",
    targetProps: { display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" },
    availableProps: {
      flexDirection: ["row", "column", "row-reverse", "column-reverse"],
      justifyContent: ["flex-start", "center", "flex-end", "space-between", "space-around"],
      alignItems: ["flex-start", "center", "flex-end", "stretch", "baseline"]
    },
    cards: 3,
    hint: "Start with flex-direction: row and think about how to align items horizontally",
    timeLimit: 120
  },
  {
    id: 2,
    title: "Flex Positioning",
    description: "Master complex item positioning in flex containers",
    level: "Intermediate",
    icon: <Star />,
    color: "indigo",
    objective: "Create a centered layout with evenly spaced items",
    targetProps: { display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" },
    availableProps: {
      flexDirection: ["row", "column", "row-reverse", "column-reverse"],
      justifyContent: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
      alignItems: ["flex-start", "center", "flex-end", "stretch", "baseline"],
      flexWrap: ["nowrap", "wrap", "wrap-reverse"]
    },
    cards: 5,
    hint: "Use space-between for horizontal spacing and center for vertical alignment",
    timeLimit: 180
  },
  {
    id: 3,
    title: "Advanced Layouts",
    description: "Create complex responsive flexbox patterns",
    level: "Advanced",
    icon: <Trophy />,
    color: "indigo",
    objective: "Build a responsive card layout that adapts to different screen sizes",
    targetProps: { display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "stretch", flexWrap: "wrap", gap: "1rem" },
    availableProps: {
      flexDirection: ["row", "column", "row-reverse", "column-reverse"],
      justifyContent: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
      alignItems: ["flex-start", "center", "flex-end", "stretch", "baseline"],
      flexWrap: ["nowrap", "wrap", "wrap-reverse"],
      gap: ["0", "0.5rem", "1rem", "1.5rem", "2rem"]
    },
    cards: 7,
    hint: "Use wrap to allow cards to flow to the next line and gap to create consistent spacing",
    timeLimit: 240
  }
];

const FlexboxMasteryGame = () => {
  // Properly use the darkMode from context
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [activeLevel, setActiveLevel] = useState(0);
  const [gameState, setGameState] = useState({
    started: false,
    completed: false,
    timeRemaining: levelData[0].timeLimit,
    score: 0,
    highScore: typeof localStorage !== 'undefined' ? parseInt(localStorage.getItem('flexboxGameHighScore') || '0') : 0,
    userProps: { display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "nowrap", gap: "0" },
    showHint: false,
    attempts: 0,
    correctMatches: 0
  });
  const [confetti, setConfetti] = useState(false);
  const timerRef = useRef(null);

  // Card items to be displayed in the containers
  const generateCards = (count) => {
    const cardColors = ['indigo', 'emerald', 'purple', 'pink'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: cardColors[i % cardColors.length],
      content: `Card ${i + 1}`
    }));
  };

 
  const selectLevel = (index) => {
    if (gameState.started) {
      if (window.confirm("Changing levels will reset your current progress. Continue?")) {
        resetGame(index);
      }
    } else {
      setActiveLevel(index);
      setGameState(prev => ({
        ...prev,
        timeRemaining: levelData[index].timeLimit,
        userProps: { display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "nowrap", gap: "0" }
      }));
    }
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, started: true }));
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timerRef.current);
          return { ...prev, timeRemaining: 0, started: false };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  };

  const pauseGame = () => {
    clearInterval(timerRef.current);
    setGameState(prev => ({ ...prev, started: false }));
  };

  const resetGame = (levelIndex = activeLevel) => {
    clearInterval(timerRef.current);
    setActiveLevel(levelIndex);
    setGameState({
      started: false,
      completed: false,
      timeRemaining: levelData[levelIndex].timeLimit,
      score: 0,
      highScore: typeof localStorage !== 'undefined' ? parseInt(localStorage.getItem('flexboxGameHighScore') || '0') : 0,
      userProps: { display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "nowrap", gap: "0" },
      showHint: false,
      attempts: 0,
      correctMatches: 0
    });
  };

  const updateUserProp = (prop, value) => {
    setGameState(prev => ({
      ...prev,
      userProps: { ...prev.userProps, [prop]: value }
    }));
  };

  const checkSolution = () => {
    const currentLevel = levelData[activeLevel];
    const targetProps = currentLevel.targetProps;
    let matches = 0;
    let totalProps = 0;
    
    for (const prop in targetProps) {
      totalProps++;
      if (gameState.userProps[prop] === targetProps[prop]) {
        matches++;
      }
    }
    
    const isCorrect = matches === totalProps;
    const newAttempts = gameState.attempts + 1;
    const scoreIncrease = isCorrect ? 
      Math.ceil((matches / totalProps) * 100 * (gameState.timeRemaining / currentLevel.timeLimit) * 10) : 0;
    
    if (isCorrect) {
      clearInterval(timerRef.current);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
      
      const newScore = gameState.score + scoreIncrease;
      const newHighScore = Math.max(newScore, gameState.highScore);
      
      if (newHighScore > gameState.highScore && typeof localStorage !== 'undefined') {
        localStorage.setItem('flexboxGameHighScore', newHighScore.toString());
      }
      
      setGameState(prev => ({
        ...prev,
        completed: true,
        score: newScore,
        highScore: newHighScore,
        correctMatches: matches,
        attempts: newAttempts
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        attempts: newAttempts,
        correctMatches: matches
      }));
    }
  };

  const toggleHint = () => {
    setGameState(prev => ({ ...prev, showHint: !prev.showHint }));
  };

  const nextLevel = () => {
    if (activeLevel < levelData.length - 1) {
      resetGame(activeLevel + 1);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentLevel = levelData[activeLevel];
  const cards = generateCards(currentLevel.cards);

  const containerClasses = (isUserContainer) => {
    const baseClasses = "relative p-6 rounded-xl min-h-64 border-2 transition-all duration-300 overflow-hidden";
    const borderClasses = isUserContainer
      ? (darkMode ? "border-indigo-600" : "border-indigo-500")
      : (darkMode ? "border-purple-600" : "border-purple-500");
    const bgClasses = darkMode ? "bg-zinc-900" : "bg-white";
    return `${baseClasses} ${borderClasses} ${bgClasses}`;
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Style for the target container
  const targetStyle = currentLevel.targetProps;

  // Generate the styles for the user container
  const userStyle = gameState.userProps;

  // Calculate progress percentage
  const progressPercentage = Math.floor((gameState.correctMatches / Object.keys(currentLevel.targetProps).length) * 100);

  return (
    <div className={`min-h-screen pt-32 transition-colors duration-300 ${darkMode ? 'bg-zinc-950 text-gray-100' : 'bg-white text-gray-900'}`}>
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Simplified confetti effect */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                backgroundColor: ['#4f46e5', '#10b981', '#9333ea', '#db2777'][Math.floor(Math.random() * 4)],
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4">
        <header className="text-center mb-8 relative">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleDarkMode}
            className={`absolute top-0 right-0 p-2 rounded-full transition-colors duration-300 ${
              darkMode ? 'bg-zinc-900 text-yellow-400 hover:bg-zinc-700' : 'bg-gray-200 text-indigo-700 hover:bg-gray-300'
            }`}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          <h1 
            className={`
              text-4xl font-bold mb-2
              bg-clip-text text-transparent
              ${darkMode 
                ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500' 
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'}
            `}
          >
            Flexbox Mastery Game
          </h1>
          <p className={`${darkMode ? 'text-zinc-400' : 'text-gray-600'} max-w-xl mx-auto`}>
            Match the target layout by selecting the correct flexbox properties
          </p>
        </header>

        {/* Controls and Levels */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            {levelData.map((level, index) => (
              <button
                key={index}
                onClick={() => selectLevel(index)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${activeLevel === index ? 'scale-105 shadow-md' : ''}
                  ${level.color === 'indigo' 
                    ? (darkMode 
                        ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200')
                    : level.color === 'emerald'
                      ? (darkMode 
                          ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/50' 
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200')
                      : (darkMode 
                          ? 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/50' 
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200')
                  }
                  ${activeLevel === index ? 'ring-2 ring-offset-2 ' + (
                    level.color === 'indigo' 
                      ? (darkMode ? 'ring-indigo-500 ring-offset-zinc-900' : 'ring-indigo-500 ring-offset-white')
                      : level.color === 'emerald'
                        ? (darkMode ? 'ring-emerald-500 ring-offset-zinc-900' : 'ring-emerald-500 ring-offset-white')
                        : (darkMode ? 'ring-purple-500 ring-offset-zinc-900' : 'ring-purple-500 ring-offset-white')
                  ) : ''}
                `}
              >
                <span className="flex items-center gap-2">
                  {React.cloneElement(level.icon, { size: 16 })}
                  {level.level}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className={`text-sm font-medium ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              Score: <span className={`${gameState.score > 0 ? 'text-green-500 font-bold' : ''}`}>{gameState.score}</span>
            </div>
            <div className={`text-sm font-medium ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              High Score: <span className="text-indigo-500 font-bold">{gameState.highScore}</span>
            </div>
           
          </div>
        </div>

        {/* Timer and Game Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className={`flex items-center gap-2 text-lg font-bold ${gameState.timeRemaining < 30 ? 'text-red-500' : ''}`}>
            <div className="w-20 text-center">{formatTime(gameState.timeRemaining)}</div>
            <div className="w-48 bg-zinc-900 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full progress-bar bg-gradient-to-r from-indigo-500 to-purple-500" 
                style={{ width: `${(gameState.timeRemaining / currentLevel.timeLimit) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {gameState.completed ? (
              <button
                onClick={nextLevel}
                disabled={activeLevel >= levelData.length - 1}
                className={`
                  px-4 py-2 rounded-md flex items-center gap-2 font-medium
                  ${activeLevel >= levelData.length - 1 
                    ? 'bg-zinc-900 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-slate-300 hover:from-indigo-700 hover:to-purple-700'}
                `}
              >
                Next Level <ArrowRight size={16} />
              </button>
            ) : gameState.started ? (
              <button
                onClick={pauseGame}
                className="px-4 py-2 rounded-md bg-amber-600 text-slate-300 hover:bg-amber-700 flex items-center gap-2 font-medium"
              >
                Pause <PauseCircle size={16} />
              </button>
            ) : (
              <button
                onClick={startGame}
                className="px-4 py-2 rounded-md bg-green-600 text-slate-300 hover:bg-green-700 flex items-center gap-2 font-medium"
              >
                {gameState.timeRemaining === currentLevel.timeLimit ? 'Start' : 'Resume'} <Play size={16} />
              </button>
            )}
            <button
              onClick={resetGame}
              className="px-4 py-2 rounded-md bg-zinc-900 text-slate-300 hover:bg-gray-600 flex items-center gap-2 font-medium"
            >
              Reset <RotateCcw size={16} />
            </button>
            <button
              onClick={toggleHint}
              className={`
                px-4 py-2 rounded-md flex items-center gap-2 font-medium
                ${gameState.showHint 
                  ? 'bg-purple-600 text-slate-300 hover:bg-purple-700' 
                  : 'bg-zinc-700 text-slate-300 hover:bg-zinc-600'}
              `}
            >
              {gameState.showHint ? 'Hide Hint' : 'Show Hint'} <Info size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>Progress: {progressPercentage}%</span>
            <span className={`text-sm font-medium ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>Attempts: {gameState.attempts}</span>
          </div>
          <div className="w-full bg-zinc-900 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full progress-bar bg-gradient-to-r from-indigo-500 to-purple-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Level Information */}
        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
          <div className="flex items-start gap-4">
            <div 
              className={`
                p-3 rounded-full
                ${currentLevel.color === 'indigo' 
                  ? (darkMode ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-100 text-indigo-600')
                  : currentLevel.color === 'emerald'
                    ? (darkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
                    : (darkMode ? 'bg-purple-900/40 text-purple-400' : 'bg-purple-100 text-purple-600')
                }
              `}
            >
              {React.cloneElement(currentLevel.icon, { size: 24 })}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">{currentLevel.title}</h2>
              <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{currentLevel.description}</p>
              <p className="text-sm mt-2 font-medium">
                <span className={`
                  ${currentLevel.color === 'indigo' 
                    ? (darkMode ? 'text-indigo-400' : 'text-indigo-600')
                    : currentLevel.color === 'emerald'
                      ? (darkMode ? 'text-emerald-400' : 'text-emerald-600')
                      : (darkMode ? 'text-purple-400' : 'text-purple-600')
                  }
                `}>
                  Objective:
                </span> {currentLevel.objective}
              </p>
            </div>
          </div>
          
          {/* Hint message */}
          {gameState.showHint && (
            <div className={`mt-4 p-3 rounded-md ${darkMode ? 'bg-zinc-700/50' : 'bg-gray-200'}`}>
              <div className="flex items-start gap-2">
                <Lightbulb className="text-yellow-400" size={20} />
                <p className="text-sm">{currentLevel.hint}</p>
              </div>
            </div>
          )}
        </div>

        {/* Game area - Target and User containers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Target Container */}
          <div>
            <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              Target Layout
            </h3>
            <div className={containerClasses(false)}>
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs bg-purple-900/30 text-purple-300">
                Target
              </div>
              <div
                className="w-full h-full flex flex-wrap"
                style={targetStyle}
              >
                {cards.map(card => (
                  <div
                    key={card.id}
                    className={`
                      rotate-card m-1 p-4 rounded-lg shadow-md w-24 h-24 flex items-center justify-center text-center
                      ${card.color === 'indigo' 
                        ? (darkMode ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-100 text-indigo-700')
                        : card.color === 'emerald'
                          ? (darkMode ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                          : card.color === 'purple'
                            ? (darkMode ? 'bg-purple-900/60 text-purple-300' : 'bg-purple-100 text-purple-700')
                            : (darkMode ? 'bg-pink-900/60 text-pink-300' : 'bg-pink-100 text-pink-700')
                      }
                    `}
                  >
                    {card.content}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Container */}
          <div>
            <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              Your Layout
            </h3>
            <div className={containerClasses(true)}>
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs bg-indigo-900/30 text-indigo-300">
                Your Solution
              </div>
              <div
                className="w-full h-full flex flex-wrap"
                style={userStyle}
              >
                {cards.map(card => (
                  <div
                    key={card.id}
                    className={`
                      rotate-card m-1 p-4 rounded-lg shadow-md w-24 h-24 flex items-center justify-center text-center
                      ${card.color === 'indigo' 
                        ? (darkMode ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-100 text-indigo-700')
                        : card.color === 'emerald'
                          ? (darkMode ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                          : card.color === 'purple'
                            ? (darkMode ? 'bg-purple-900/60 text-purple-300' : 'bg-purple-100 text-purple-700')
                            : (darkMode ? 'bg-pink-900/60 text-pink-300' : 'bg-pink-100 text-pink-700')
                      }
                    `}
                  >
                    {card.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {gameState.completed && (
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30">
            <div className="flex items-center gap-4 mb-4">
              <Award className="text-yellow-400" size={32} />
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-400">
                Level Complete!
              </h3>
            </div>
            <p className="text-zinc-300 mb-4">
              Congratulations! You successfully matched the target layout!
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-zinc-900/70' : 'bg-white'}`}>
                <p className="text-sm font-medium text-zinc-400 mb-1">Score</p>
                <p className="text-2xl font-bold text-green-500">{gameState.score}</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-zinc-900/70' : 'bg-white'}`}>
                <p className="text-sm font-medium text-zinc-400 mb-1">Time Remaining</p>
                <p className="text-2xl font-bold text-indigo-400">{formatTime(gameState.timeRemaining)}</p>
              </div>
            </div>
          </div>
        )}


        {/* Flexbox Properties Controls */}
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'} mb-6`}>
          <h3 className="text-lg font-bold mb-4">Flexbox Properties</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(currentLevel.availableProps).map(([prop, values]) => (
              <div key={prop} className="property-highlight">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
                  {prop.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <div className="relative">
                  <select
                    value={gameState.userProps[prop] || ''}
                    onChange={(e) => updateUserProp(prop, e.target.value)}
                    disabled={!gameState.started || gameState.completed}
                    className={`
                      w-full p-3 pr-10 rounded-lg border text-sm
                      ${!gameState.started || gameState.completed ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
                      ${darkMode 
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-300 focus:border-indigo-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'}
                      transition-colors duration-300
                    `}
                  >
                    {values.map(value => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {gameState.userProps[prop] === currentLevel.targetProps[prop] && (
                      <Check className="text-green-500" size={16} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button
              onClick={checkSolution}
              disabled={!gameState.started || gameState.completed}
              className={`
                w-full py-3 rounded-lg font-medium text-center
                ${!gameState.started || gameState.completed
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-slate-300 hover:from-indigo-700 hover:to-purple-700 shadow-lg'}
                transition-all duration-300
              `}
            >
              {gameState.completed ? 'Completed!' : 'Check Solution'}
            </button>
          </div>
        </div>
        {/* CSS Code Output */}
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
          <h3 className="text-lg font-bold mb-4">CSS Code</h3>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-zinc-900 text-gray-300' : 'bg-gray-200 text-gray-800'} font-mono text-sm overflow-auto`}>
            <pre>{`.container {
  display: ${gameState.userProps.display};
  flex-direction: ${gameState.userProps.flexDirection};
  justify-content: ${gameState.userProps.justifyContent};
  align-items: ${gameState.userProps.alignItems};
  ${gameState.userProps.flexWrap !== 'nowrap' ? `flex-wrap: ${gameState.userProps.flexWrap};` : ''}
  ${gameState.userProps.gap !== '0' ? `gap: ${gameState.userProps.gap};` : ''}
}`}</pre>
          </div>
        </div>

        {/* Game Explanation */}
        <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-zinc-900/60' : 'bg-gray-50'}`}>
          <div className="flex items-start gap-3 mb-4">
            <FileCheck className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} size={24} />
            <h3 className="text-lg font-bold">How to Play</h3>
          </div>
          
          <ol className={`list-decimal list-inside space-y-2 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
            <li>Select a difficulty level (Beginner, Intermediate, or Advanced)</li>
            <li>Press "Start" to begin the challenge</li>
            <li>Compare your layout to the target layout</li>
            <li>Use the Flexbox controls to match your layout with the target</li>
            <li>Click "Check Solution" when you think you've matched the layout</li>
            <li>Use the "Show Hint" button if you need help</li>
          </ol>
          
          <div className={`mt-4 text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
            <p>Your score is based on how quickly you solve each level and how many properties you correctly match. Complete all levels to become a Flexbox master!</p>
          </div>
        </div>
      </div>

      <footer className={`mt-12 py-6 ${darkMode ? 'bg-zinc-900 text-zinc-500' : 'bg-gray-100 text-gray-600'}`}>
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>Flexbox Mastery Game — Learn CSS Flexbox interactively</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        .progress-bar {
          transition: width 1s ease-in-out;
        }
        
        .rotate-card {
          transition: all 0.3s ease;
        }
        
        .rotate-card:hover {
          transform: translateY(-5px) rotate(2deg);
        }
        
        .property-highlight {
          transition: all 0.3s ease;
        }
        
        .property-highlight:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default FlexboxMasteryGame;