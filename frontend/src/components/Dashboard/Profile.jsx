import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Code, Github, Award, ExternalLink, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';

const Profile = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [developerScore, setDeveloperScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          throw new Error('Email not found in localStorage');
        }

        // Fetch profile data
        const profileResponse = await fetch(`https://coding-dashboard-ngwi.onrender.com/api/codingkaro/users?email=${email}`);
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const profileData = await profileResponse.json();
        setUserProfile(profileData);

        // Fetch developer score
        const scoreResponse = await fetch(`https://coding-dashboard-ngwi.onrender.com/api/codingkaro/users/score?email=${email}`);
        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json();
          setDeveloperScore(scoreData);
        }

        // Initialize expanded sections based on available data
        if (profileData.platformStats) {
          const initialExpandedState = Object.keys(profileData.platformStats).reduce((acc, platform) => {
            acc[platform] = true; // Initially expand all platform sections
            return acc;
          }, {});
          setExpandedSections(initialExpandedState);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Theme based styling
  const getThemeClasses = {
    bg: isDarkMode ? 'bg-black' : 'bg-white',
    card: isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200',
    heading: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    mutedText: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    primaryGradient: 'from-indigo-600 to-violet-600',
    primary: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
    button: isDarkMode ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700',
    buttonSecondary: isDarkMode ? 'bg-zinc-700 hover:bg-zinc-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    statsCard: isDarkMode ? 'bg-zinc-700' : 'bg-gray-100',
    tableHead: isDarkMode ? 'bg-zinc-700' : 'bg-gray-100',
    tableRow: isDarkMode ? 'border-zinc-700' : 'border-gray-200',
    progressBarBg: isDarkMode ? 'bg-zinc-600' : 'bg-gray-200'
  };

  // Platform specific colors
  const platformColors = {
    leetcode: {
      light: 'text-yellow-600 bg-yellow-100',
      dark: 'text-yellow-300 bg-yellow-900/30',
      progress: 'bg-yellow-500'
    },
    github: {
      light: 'text-gray-700 bg-gray-100',
      dark: 'text-gray-300 bg-gray-700/50',
      progress: 'bg-gray-700'
    },
    geeksforgeeks: {
      light: 'text-green-600 bg-green-100',
      dark: 'text-green-300 bg-green-900/30',
      progress: 'bg-green-600'
    }
  };

  const getPlatformColor = (platform, type) => {
    const colors = platformColors[platform] || platformColors.github;
    return isDarkMode ? colors.dark : colors.light;
  };

  const getPlatformProgressColor = (platform) => {
    return platformColors[platform]?.progress || 'bg-indigo-500';
  };

  if (loading) return (
    <div className={`flex justify-center items-center h-screen ${getThemeClasses.bg}`}>
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-solid border-t-transparent border-indigo-500"></div>
    </div>
  );
  
  if (error) return (
    <div className={`${getThemeClasses.bg} min-h-screen p-4`}>
      <div className={`${isDarkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-white border-red-400 text-red-700'} px-4 py-3 rounded-lg border my-4 mx-auto max-w-2xl`}>
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );
  
  if (!userProfile) return (
    <div className={`${getThemeClasses.bg} min-h-screen p-4`}>
      <div className={`text-center p-8 ${getThemeClasses.card} rounded-lg shadow my-4 mx-auto max-w-2xl`}>
        <h3 className={`text-xl font-medium ${getThemeClasses.heading}`}>No profile data available</h3>
        <p className={`mt-2 ${getThemeClasses.mutedText}`}>Please add your coding platform usernames in settings.</p>
      </div>
    </div>
  );

  // Helper function to render LeetCode stats
  const renderLeetCodeStats = (data) => {
    const { stats } = data;
    const sectionId = 'leetcode';
    const isExpanded = expandedSections[sectionId] !== false;

    return (
      <div className={`${getThemeClasses.card} rounded-lg shadow border p-6 mb-6 transition-all duration-300`}>
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            {stats.profile.userAvatar && (
              <img 
                src={stats.profile.userAvatar} 
                alt="LeetCode Avatar" 
                className={`w-16 h-16 rounded-full mr-4 border-2 ${isDarkMode ? 'border-yellow-500/70' : 'border-yellow-500'}`}
              />
            )}
            <div>
              <h3 className={`text-xl font-bold ${getThemeClasses.heading}`}>{stats.profile.realName || stats.username}</h3>
              <p className={`text-sm ${getThemeClasses.mutedText}`}>@{stats.username}</p>
              {stats.profile.aboutMe && (
                <p className={`mt-2 ${getThemeClasses.text} text-sm`}>{stats.profile.aboutMe}</p>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => toggleSection(sectionId)} 
            className={`${getThemeClasses.buttonSecondary} p-2 rounded-full transition-colors`}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${getThemeClasses.statsCard} p-4 rounded-lg`}>
                <h4 className={`font-semibold ${getThemeClasses.heading}`}>Problem Solving</h4>
                <div className="mt-2">
                  <p className={`flex justify-between ${getThemeClasses.text}`}>
                    <span>Total Solved:</span>
                    <span className="font-medium">{stats.problemStats.totalSolved}</span>
                  </p>
                  <p className={`flex justify-between ${getThemeClasses.text}`}>
                    <span>Total Submissions:</span> 
                    <span className="font-medium">{stats.problemStats.totalSubmissions}</span>
                  </p>
                  <div className="mt-3">
                    <h5 className={`text-sm font-medium mb-2 ${getThemeClasses.text}`}>Difficulty Breakdown:</h5>
                    <div className="flex space-x-2">
                      <span className={`${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'} text-xs px-2 py-1 rounded`}>
                        Easy: {stats.problemStats.difficulty.easy || 0}
                      </span>
                      <span className={`${isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'} text-xs px-2 py-1 rounded`}>
                        Medium: {stats.problemStats.difficulty.medium || 0}
                      </span>
                      <span className={`${isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded`}>
                        Hard: {stats.problemStats.difficulty.hard || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${getThemeClasses.statsCard} p-4 rounded-lg`}>
                <h4 className={`font-semibold ${getThemeClasses.heading}`}>Contest Stats</h4>
                {stats.contestStats ? (
                  <div className="mt-2">
                    <p className={`flex justify-between ${getThemeClasses.text}`}>
                      <span>Rating:</span>
                      <span className="font-medium">{Math.round(stats.contestStats.rating)}</span>
                    </p>
                    <p className={`flex justify-between ${getThemeClasses.text}`}>
                      <span>Contests:</span>
                      <span className="font-medium">{stats.contestStats.attended}</span>
                    </p>
                    <p className={`flex justify-between ${getThemeClasses.text}`}>
                      <span>Global Rank:</span>
                      <span className="font-medium">
                        {stats.contestStats.globalRanking.toLocaleString()}
                        <span className={`text-xs ${getThemeClasses.mutedText}`}> 
                          (Top {stats.contestStats.topPercentage.toFixed(1)}%)
                        </span>
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className={`${getThemeClasses.mutedText} text-sm italic mt-2`}>No contest data available</p>
                )}
              </div>

              <div className={`${getThemeClasses.statsCard} p-4 rounded-lg`}>
                <h4 className={`font-semibold ${getThemeClasses.heading}`}>Activity</h4>
                <div className="mt-2">
                  <p className={`flex justify-between ${getThemeClasses.text}`}>
                    <span>Current Streak:</span>
                    <span className="font-medium">{stats.calendar.streak} days</span>
                  </p>
                  <p className={`flex justify-between ${getThemeClasses.text}`}>
                    <span>Active Days:</span>
                    <span className="font-medium">{stats.calendar.totalActiveDays}</span>
                  </p>
                  <p className={`flex justify-between ${getThemeClasses.text}`}>
                    <span>Badges:</span>
                    <span className="font-medium">{stats.badges.length}</span>
                  </p>
                </div>
                {stats.badges.length > 0 && (
                  <div className="mt-3">
                    <h5 className={`text-sm font-medium mb-2 ${getThemeClasses.text}`}>Recent Badges:</h5>
                    <div className="flex flex-wrap gap-2">
                      {stats.badges.slice(0, 3).map((badge) => (
                        <div key={badge.id} className={`${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-800'} text-xs px-2 py-1 rounded-full`}>
                          {badge.displayName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h4 className={`font-semibold ${getThemeClasses.heading} mb-2`}>Top Skills</h4>
              <div className="flex flex-wrap gap-2">
                {stats.problemStats.byTags.fundamental
                  .sort((a, b) => b.problemsSolved - a.problemsSolved)
                  .slice(0, 5)
                  .map((tag) => (
                    <span key={tag.tagName} className={`${isDarkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-800'} text-xs px-2 py-1 rounded`}>
                      {tag.tagName}: {tag.problemsSolved}
                    </span>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Helper function to render GitHub stats
  const renderGitHubStats = (data) => {
    const { stats } = data;
    const sectionId = 'github';
    const isExpanded = expandedSections[sectionId] !== false;

    return (
      <div className={`${getThemeClasses.card} rounded-lg shadow border p-6 mb-6 transition-all duration-300`}>
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            {stats.profile.avatar && (
              <img 
                src={stats.profile.avatar} 
                alt="GitHub Avatar" 
                className={`w-16 h-16 rounded-full mr-4 border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
              />
            )}
            <div>
              <h3 className={`text-xl font-bold ${getThemeClasses.heading}`}>{stats.profile.name || stats.username}</h3>
              <p className={`text-sm ${getThemeClasses.mutedText}`}>@{stats.profile.login}</p>
              {stats.profile.bio && (
                <p className={`mt-2 ${getThemeClasses.text} text-sm`}>{stats.profile.bio}</p>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => toggleSection(sectionId)} 
            className={`${getThemeClasses.buttonSecondary} p-2 rounded-full transition-colors`}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${getThemeClasses.statsCard} p-4 rounded-lg`}>
                <h4 className={`font-semibold ${getThemeClasses.heading}`}>Profile Stats</h4>
                <div className="mt-2">
                  <p className={`flex justify-between ${getThemeClasses.text}`}>
                    <span>Public Repos:</span>
                    <span className="font-medium">{stats.stats.publicRepos}</span>
                  </p>
                  <p className={`flex justify-between ${getThemeClasses.text}`}>
                    <span>Followers:</span>
                    <span className="font-medium">{stats.stats.followers}</span>
                  </p>
                  <p className={`flex justify-between ${getThemeClasses.text}`}>
                    <span>Following:</span>
                    <span className="font-medium">{stats.stats.following}</span>
                  </p>
                  <p className={`flex justify-between ${getThemeClasses.text}`}>
                    <span>Total Stars:</span>
                    <span className="font-medium">{stats.stats.totalStars}</span>
                  </p>
                </div>
              </div>

              <div className={`${getThemeClasses.statsCard} p-4 rounded-lg`}>
                <h4 className={`font-semibold ${getThemeClasses.heading}`}>Location & Contact</h4>
                <div className="mt-2">
                  {stats.profile.location ? (
                    <p className={`flex justify-between ${getThemeClasses.text}`}>
                      <span>Location:</span>
                      <span className="font-medium">{stats.profile.location}</span>
                    </p>
                  ) : (
                    <p className={`${getThemeClasses.mutedText} text-sm italic`}>No location provided</p>
                  )}
                  
                  {stats.profile.company && (
                    <p className={`flex justify-between ${getThemeClasses.text}`}>
                      <span>Company:</span>
                      <span className="font-medium">{stats.profile.company}</span>
                    </p>
                  )}
                  
                  {stats.profile.blog && (
                    <p className={`flex justify-between ${getThemeClasses.text}`}>
                      <span>Website:</span>
                      <a 
                        href={stats.profile.blog} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`font-medium ${getThemeClasses.primary} hover:underline flex items-center truncate max-w-xs`}
                      >
                        {stats.profile.blog}
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {stats.repositories && stats.repositories.length > 0 && (
              <div className="mt-6">
                <h4 className={`font-semibold ${getThemeClasses.heading} mb-2`}>Repositories</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className={getThemeClasses.tableHead}>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses.mutedText} uppercase tracking-wider`}>Name</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses.mutedText} uppercase tracking-wider`}>Language</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses.mutedText} uppercase tracking-wider`}>Updated</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses.mutedText} uppercase tracking-wider`}>Stars</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses.mutedText} uppercase tracking-wider`}>Forks</th>
                      </tr>
                    </thead>
                    <tbody className={getThemeClasses.text}>
                      {stats.repositories
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort by update date (newest first)
                        .map((repo) => (
                          <tr key={repo.name} className={`border-t ${getThemeClasses.tableRow} hover:${isDarkMode ? 'bg-zinc-700/50' : 'bg-gray-50'}`}>
                            <td className="px-4 py-2">
                              <a href={repo.url} target="_blank" rel="noopener noreferrer" className={`${getThemeClasses.primary} hover:underline flex items-center`}>
                                {repo.name}
                                <ExternalLink size={14} className="ml-1" />
                              </a>
                              {repo.description && (
                                <p className={`text-xs ${getThemeClasses.mutedText} truncate max-w-xs`}>{repo.description}</p>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm">{repo.language || 'N/A'}</td>
                            <td className="px-4 py-2 text-sm">{new Date(repo.updatedAt).toLocaleDateString()}</td>
                            <td className="px-4 py-2 text-sm">{repo.stars}</td>
                            <td className="px-4 py-2 text-sm">{repo.forks}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {stats.languages && stats.languages.length > 0 && (
              <div className="mt-6">
                <h4 className={`font-semibold ${getThemeClasses.heading} mb-2`}>Top Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.languages.slice(0, 5).map((lang) => (
                    <span key={lang.name} className={`${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'} text-xs px-2 py-1 rounded`}>
                      {lang.name}: {lang.count}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Function to render GeeksforGeeks stats
  const renderGeeksForGeeksStats = (data) => {
    const { stats } = data;
    const sectionId = 'geeksforgeeks';
    const isExpanded = expandedSections[sectionId] !== false;

    return (
      <div className={`${getThemeClasses.card} rounded-lg shadow border p-6 mb-6 transition-all duration-300`}>
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            {stats.profile.avatar && (
              <img 
                src={stats.profile.avatar} 
                alt="GeeksforGeeks Avatar" 
                className={`w-16 h-16 rounded-full mr-4 border-2 ${isDarkMode ? 'border-green-500/70' : 'border-green-500'}`}
              />
            )}
            <div>
              <h3 className={`text-xl font-bold ${getThemeClasses.heading}`}>{stats.profile.name}</h3>
              <p className={`text-sm ${getThemeClasses.mutedText}`}>{stats.profile.institute}</p>
              <p className={`text-sm ${getThemeClasses.mutedText}`}>Rank: {stats.profile.ranking}</p>
            </div>
          </div>
          
          <button 
            onClick={() => toggleSection(sectionId)} 
            className={`${getThemeClasses.buttonSecondary} p-2 rounded-full transition-colors`}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${getThemeClasses.statsCard} p-4 rounded-lg`}>
                <h4 className={`font-semibold ${getThemeClasses.heading}`}>Problem Stats</h4>
                <div className="mt-2">
                  {Object.entries(stats.problemStats || {}).map(([category, count]) => (
                    <p key={category} className={`flex justify-between ${getThemeClasses.text}`}>
                      <span>{category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                      <span className="font-medium">{count}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className={`${getThemeClasses.statsCard} p-4 rounded-lg`}>
                <h4 className={`font-semibold ${getThemeClasses.heading}`}>Coding Scores</h4>
                <div className="mt-2">
                  {Object.entries(stats.codingScores || {}).map(([score, value]) => (
                    <p key={score} className={`flex justify-between ${getThemeClasses.text}`}>
                      <span>{score.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                      <span className="font-medium">{value}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {stats.badges && stats.badges.length > 0 && (
              <div className="mt-6">
                <h4 className={`font-semibold ${getThemeClasses.heading} mb-2`}>Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.badges.map((badge) => (
                    <div key={badge.name} className={`${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'} text-xs px-2 py-1 rounded`}>
                      {badge.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.monthlyActivity && Object.keys(stats.monthlyActivity).length > 0 && (
              <div className="mt-6">
                <h4 className={`font-semibold ${getThemeClasses.heading} mb-2`}>Recent Activity</h4>
                <div className={`${getThemeClasses.statsCard} p-4 rounded-lg`}>
                  <div className="grid grid-cols-7 gap-1">
                    {Object.entries(stats.monthlyActivity)
                      .slice(0, 1) // Just show the most recent month
                      .flatMap(([month, days]) => 
                        days.slice(-28).map((day, index) => (
                          <div 
                            key={index} 
                            className={`w-4 h-4 rounded-sm ${
                              day.count === 0 ? (isDarkMode ? 'bg-zinc-600' : 'bg-gray-200') :
                              day.count < 3 ? (isDarkMode ? 'bg-green-900/70' : 'bg-green-200') :
                              day.count < 5 ? (isDarkMode ? 'bg-green-800/70' : 'bg-green-300') :
                              (isDarkMode ? 'bg-green-600' : 'bg-green-500')
                            }`}
                            title={`${day.date}: ${day.count} contributions`}
                          ></div>
                        ))
                      )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };


  // Function to render developer score dashboard
  const renderDeveloperScore = () => {
    if (!developerScore) return null;
    
    return (
      <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} rounded-lg shadow-md p-6 mb-6 transition-colors duration-300`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Developer Score</h2>
        
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">{Math.round(developerScore.totalScore)}</p>
              <p className="text-sm mt-1">Overall Developer Score</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Based on your activity across:</p>
              <p className="text-sm">{Object.keys(developerScore.platformScores).join(', ')}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Platform Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(developerScore.platformScores).map(([platform, score]) => (
              <div key={platform} className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'} p-4 rounded-lg transition-colors duration-300`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                  <span className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {Math.round(score)}
                  </span>
                </div>
                <div className={`w-full ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-200'} rounded-full h-2.5 transition-colors duration-300`}>
                  <div 
                    className={`h-2.5 rounded-full ${
                      platform === 'leetcode' ? 'bg-yellow-500' :
                      platform === 'github' ? (isDarkMode ? 'bg-gray-300' : 'bg-gray-700') :
                      platform === 'geeksforgeeks' ? 'bg-green-600' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, (score / developerScore.totalScore) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Function to render missing platforms section
  const renderMissingPlatforms = () => {
    if (!userProfile.missingPlatforms || userProfile.missingPlatforms.length === 0) return null;
    
    return (
      <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} rounded-lg shadow-md p-6 mb-6 transition-colors duration-300`}>
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Complete Your Profile</h2>
        <p className={`mb-4 ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>
          Add these platforms to enhance your developer profile and improve your overall score:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userProfile.missingPlatforms.map(platform => (
            <div key={platform} className={`border ${isDarkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-gray-200'} rounded-lg p-4 text-center transition-colors duration-300`}>
              <div className={`text-3xl mb-2 ${
                platform === 'leetcode' ? 'text-yellow-500' :
                platform === 'github' ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') :
                platform === 'geeksforgeeks' ? 'text-green-600' :
                'text-blue-500'
              }`}>
                {platform === 'leetcode' ? '🏆' :
                platform === 'github' ? '🐙' :
                platform === 'geeksforgeeks' ? '🧠' : '💻'}
              </div>
              <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'} mb-3`}>
                {platform === 'leetcode' ? 'Add your competitive coding skills' :
                platform === 'github' ? 'Showcase your projects and contributions' :
                platform === 'geeksforgeeks' ? 'Display your DSA knowledge' :
                'Add your coding profile'}
              </p>
              <button className={`w-full ${
                isDarkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white py-2 px-4 rounded-lg text-sm transition duration-200`}>
                Connect {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className={` pt-32
      ${isDarkMode ? 'bg-black text-gray-100' : 'bg-white text-gray-900'}
      min-h-screen transition-colors duration-300
    `}>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Developer Profile</h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-white text-lg font-medium">{userProfile.name}</p>
              <p className="text-blue-100">{userProfile.email}</p>
            </div>
            
            {userProfile.missingPlatforms && userProfile.missingPlatforms.length > 0 && (
              <div className="mt-4 md:mt-0">
                <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition">
                  Update Profile Settings
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Developer Score Section */}
        {renderDeveloperScore()}
        
        {/* Missing Platforms Section */}
        {renderMissingPlatforms()}

        {/* Platform Profiles */}
        <div className="space-y-6">
          {userProfile.platformStats && Object.entries(userProfile.platformStats).map(([platform, data]) => (
            <div key={platform}>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100 border-zinc-800' : 'text-gray-800 border-gray-200'} border-b pb-2 transition-colors duration-300`}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)} Profile
              </h2>
              
              {platform === 'leetcode' && renderLeetCodeStats(data)}
              {platform === 'github' && renderGitHubStats(data)}
              {platform === 'geeksforgeeks' && renderGeeksForGeeksStats(data)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;