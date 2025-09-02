import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Layers, 
  Globe, 
  Smartphone, 
  Server,
  GitBranch,
  Brain,
  Trophy,
  Target,
  TrendingUp,
  Star
} from 'lucide-react';

const SkillsOverview = ({ user }) => {
  const extractSkillsFromPlatforms = () => {
    if (!user?.platformStats) return { languages: {}, topics: {}, skills: {} };

    const skills = {
      languages: {},
      topics: {},
      skills: {}
    };

    Object.entries(user.platformStats).forEach(([platform, data]) => {
      const stats = data.stats;
      if (!stats) return;

      switch(platform) {
        case 'leetcode':
          // Extract programming topics from LeetCode
          if (stats.tagProblemCounts) {
            const allTags = [
              ...(stats.tagProblemCounts.fundamental || []),
              ...(stats.tagProblemCounts.intermediate || []),
              ...(stats.tagProblemCounts.advanced || [])
            ];
            
            allTags.forEach(tag => {
              if (tag.tagName && tag.problemsSolved > 0) {
                skills.topics[tag.tagName] = (skills.topics[tag.tagName] || 0) + tag.problemsSolved;
              }
            });
          }
          break;

        case 'github':
          // Extract languages from GitHub
          if (stats.languages) {
            stats.languages.forEach(lang => {
              skills.languages[lang.name] = (skills.languages[lang.name] || 0) + lang.count;
            });
          }
          break;

        case 'geeksforgeeks':
          // Extract coding skills from GeeksforGeeks
          if (stats.problemStats) {
            Object.entries(stats.problemStats).forEach(([category, count]) => {
              const normalizedCategory = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              skills.skills[normalizedCategory] = parseInt(count || 0);
            });
          }
          break;
      }
    });

    return skills;
  };

  const skillsData = extractSkillsFromPlatforms();

  const predefinedSkills = [
    {
      category: 'Frontend',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      skills: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'HTML', 'CSS', 'SCSS']
    },
    {
      category: 'Backend',
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      skills: ['Node.js', 'Python', 'Java', 'C++', 'Go', 'PHP', 'Ruby', 'C#']
    },
    {
      category: 'Database',
      icon: Database,
      color: 'from-purple-500 to-violet-500',
      skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Oracle']
    },
    {
      category: 'Mobile',
      icon: Smartphone,
      color: 'from-pink-500 to-rose-500',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic']
    },
    {
      category: 'DevOps',
      icon: Layers,
      color: 'from-orange-500 to-amber-500',
      skills: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Jenkins', 'GitLab CI']
    },
    {
      category: 'Data Science',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500',
      skills: ['Python', 'R', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn']
    }
  ];

  const getSkillLevel = (skillName, skillsData) => {
    const normalizedSkill = skillName.toLowerCase();
    
    // Check in languages
    const langMatch = Object.entries(skillsData.languages).find(([lang]) => 
      lang.toLowerCase().includes(normalizedSkill) || normalizedSkill.includes(lang.toLowerCase())
    );
    if (langMatch) return Math.min(5, Math.ceil(langMatch[1] / 5));

    // Check in topics
    const topicMatch = Object.entries(skillsData.topics).find(([topic]) => 
      topic.toLowerCase().includes(normalizedSkill) || normalizedSkill.includes(topic.toLowerCase())
    );
    if (topicMatch) return Math.min(5, Math.ceil(topicMatch[1] / 10));

    // Check in skills
    const skillMatch = Object.entries(skillsData.skills).find(([skill]) => 
      skill.toLowerCase().includes(normalizedSkill) || normalizedSkill.includes(skill.toLowerCase())
    );
    if (skillMatch) return Math.min(5, Math.ceil(skillMatch[1] / 5));

    return 0;
  };

  const topLanguages = Object.entries(skillsData.languages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const topTopics = Object.entries(skillsData.topics)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-300">Skills & Technologies</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Based on platform activity
        </div>
      </div>

      {/* Top Languages */}
      {topLanguages.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-4 flex items-center">
            <Code2 className="w-5 h-5 mr-2 text-blue-500" />
            Programming Languages
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {topLanguages.map(([language, count], index) => (
              <motion.div
                key={language}
                className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {count}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                  {language}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-zinc-900 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (count / Math.max(...topLanguages.map(([,c]) => c))) * 100)}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Topics */}
      {topTopics.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            Algorithm Topics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topTopics.map(([topic, count], index) => (
              <motion.div
                key={topic}
                className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {topic.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                    {count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-900 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (count / Math.max(...topTopics.map(([,c]) => c))) * 100)}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Technology Stack */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-6 flex items-center">
          <Layers className="w-5 h-5 mr-2 text-green-500" />
          Technology Stack
        </h3>
        <div className="space-y-6">
          {predefinedSkills.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.category}
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                    <Icon className="w-5 h-5 text-slate-300" />
                  </div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-slate-300">
                    {category.category}
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 ml-10">
                  {category.skills.map((skill, skillIndex) => {
                    const level = getSkillLevel(skill, skillsData);
                    return (
                      <motion.div
                        key={skill}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          level > 0 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                            : 'bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-gray-600'
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: skillIndex * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            level > 0 
                              ? 'text-green-700 dark:text-green-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {skill}
                          </span>
                          {level > 0 && (
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < level 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        {level > 0 && (
                          <div className="mt-2 w-full bg-gray-200 dark:bg-zinc-900 rounded-full h-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full transition-all duration-500"
                              style={{ width: `${(level / 5) * 100}%` }}
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Skills Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Languages</p>
              <p className="text-3xl font-bold">{Object.keys(skillsData.languages).length}</p>
            </div>
            <Code2 className="w-10 h-10 opacity-75" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Topics Mastered</p>
              <p className="text-3xl font-bold">{Object.keys(skillsData.topics).length}</p>
            </div>
            <Target className="w-10 h-10 opacity-75" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Skill Level</p>
              <p className="text-3xl font-bold">
                {Object.values(skillsData.languages).length > 0 ? 'Advanced' : 'Beginner'}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-75" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillsOverview;
