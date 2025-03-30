const axios = require('axios');
const cheerio = require('cheerio');
const User = require('../models/User');

// Add GeeksforGeeks to supported platforms
const SUPPORTED_PLATFORMS = [
  'leetcode', 
  'github', 
  'geeksforgeeks',
  'hackerrank', 
  'codechef', 
  'codeforces', 
  'hackerearth', 
  'kaggle', 
  'topcoder', 
  'atcoder', 
  'spoj'
];

// Utility function for creating custom headers
const createHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'Accept-Language': 'en-US,en;q=0.9'
});

// Platform validation strategies - added GeeksforGeeks
const platformValidationStrategies = {
  leetcode: async (username) => {
    try {
      const graphqlResponse = await axios.post('https://leetcode.com/graphql', {
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
            }
          }
        `,
        variables: { username }
      }, {
        headers: createHeaders()
      });
      return !!graphqlResponse.data.data.matchedUser;
    } catch (error) {
      try {
        const profileUrl = `https://leetcode.com/${username}`;
        const response = await axios.get(profileUrl, { headers: createHeaders() });
        const $ = cheerio.load(response.data);
        return $('.user-profile-name').length > 0;
      } catch {
        return false;
      }
    }
  },
  
  github: async (username) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: createHeaders()
      });
      return response.status === 200;
    } catch {
      return false;
    }
  },

  geeksforgeeks: async (username) => {
    try {
      const profileUrl = `https://auth.geeksforgeeks.org/user/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders() });
      const $ = cheerio.load(response.data);
      return $('.profile_name').length > 0;
    } catch {
      return false;
    }
  },

  hackerrank: async (username) => {
    try {
      const profileUrl = `https://www.hackerrank.com/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders() });
      const $ = cheerio.load(response.data);
      return $('.profile-username').length > 0;
    } catch {
      return false;
    }
  },

  // Other platform validations remain the same...
};

// Enhanced platform stats fetching strategies
const platformStatsFetching = {
  leetcode: async (username) => {
    try {
      // Fetch basic user data
      const graphqlResponse = await axios.post('https://leetcode.com/graphql', {
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
                totalSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                realName
                aboutMe
                userAvatar
                ranking
                reputation
                starRating
                skillTags
              }
              badges {
                id
                displayName
                icon
                creationDate
              }
              tagProblemCounts {
                advanced {
                  tagName
                  problemsSolved
                }
                intermediate {
                  tagName
                  problemsSolved
                }
                fundamental {
                  tagName
                  problemsSolved
                }
              }
            }
            userContestRanking(username: $username) {
              attendedContestsCount
              rating
              globalRanking
              totalParticipants
              topPercentage
              badge {
                name
              }
            }
            userContestRankingHistory(username: $username) {
              contest {
                title
                startTime
              }
              rating
              ranking
              attended
            }
          }
        `,
        variables: { username }
      }, { headers: createHeaders() });

      const userData = graphqlResponse.data.data.matchedUser;
      const contestRanking = graphqlResponse.data.data.userContestRanking;
      const contestHistory = graphqlResponse.data.data.userContestRankingHistory || [];

      // Fetch contribution calendar data (heatmap)
      const calendarResponse = await axios.post('https://leetcode.com/graphql', {
        query: `
          query userProfileCalendar($username: String!, $year: Int) {
            matchedUser(username: $username) {
              userCalendar(year: $year) {
                activeYears
                streak
                totalActiveDays
                submissionCalendar
              }
            }
          }
        `,
        variables: { username, year: new Date().getFullYear() }
      }, { headers: createHeaders() });

      const calendarData = calendarResponse.data.data.matchedUser.userCalendar;
      
      // Process submission stats
      const submitStats = userData.submitStats.acSubmissionNum;
      const totalSubmitStats = userData.submitStats.totalSubmissionNum;

      return {
        username: userData.username,
        profile: {
          realName: userData.profile.realName,
          aboutMe: userData.profile.aboutMe,
          userAvatar: userData.profile.userAvatar,
          ranking: userData.profile.ranking,
          reputation: userData.profile.reputation,
          starRating: userData.profile.starRating,
          skillTags: userData.profile.skillTags
        },
        problemStats: {
          totalSolved: submitStats.reduce((sum, stat) => sum + stat.count, 0),
          totalSubmissions: totalSubmitStats.reduce((sum, stat) => sum + stat.count, 0),
          difficulty: submitStats.reduce((acc, stat) => {
            acc[stat.difficulty.toLowerCase()] = stat.count;
            return acc;
          }, {}),
          byTags: {
            advanced: userData.tagProblemCounts?.advanced || [],
            intermediate: userData.tagProblemCounts?.intermediate || [],
            fundamental: userData.tagProblemCounts?.fundamental || []
          }
        },
        contestStats: contestRanking ? {
          attended: contestRanking.attendedContestsCount,
          rating: contestRanking.rating,
          globalRanking: contestRanking.globalRanking,
          totalParticipants: contestRanking.totalParticipants,
          topPercentage: contestRanking.topPercentage,
          badge: contestRanking.badge?.name
        } : null,
        contestHistory: contestHistory.map(item => ({
          title: item.contest.title,
          date: new Date(item.contest.startTime * 1000).toISOString().split('T')[0],
          rating: item.rating,
          ranking: item.ranking,
          attended: item.attended
        })),
        badges: userData.badges || [],
        calendar: {
          activeYears: calendarData?.activeYears || [],
          streak: calendarData?.streak || 0,
          totalActiveDays: calendarData?.totalActiveDays || 0,
          submissionCalendar: calendarData?.submissionCalendar ? 
            JSON.parse(calendarData.submissionCalendar) : {}
        }
      };
    } catch (error) {
      console.error('LeetCode stats fetch failed', error);
      return null;
    }
  },
  github: async (username) => {
    try {
      // Helper function for rate limiting
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Fetch the GitHub profile page
      const profileResponse = await axios.get(`https://github.com/${username}`, { 
        headers: createHeaders() 
      });
      const $ = cheerio.load(profileResponse.data);
  
      // Extract basic profile information
      const name = $('h1.vcard-names .p-name').text().trim();
      const login = $('span.p-nickname').text().trim();
      const bio = $('div.p-note.user-profile-bio').text().trim();
      const company = $('li.p-org div.p-org-details').text().trim();
      const location = $('li.p-label span.p-label').eq(0).text().trim();
      const blog = $('li.p-label a').eq(0).attr('href');
      const avatar = $('img.avatar.avatar-user').attr('src');
      const htmlUrl = `https://github.com/${username}`;
      const createdAt = $('li.p-label relative-time').attr('datetime');
  
      // Extract stats
      const followers = parseInt($('span.text-bold').eq(0).text().replace(',', '') || '0');
      const following = parseInt($('span.text-bold').eq(1).text().replace(',', '') || '0');
      const publicRepos = parseInt($('span.text-bold').eq(2).text().replace(',', '') || '0');
      const publicGists = parseInt($('span.text-bold').eq(3).text().replace(',', '') || '0');
  
      // Extract contribution stats
      const contributionStats = {
        total: $('.js-yearly-contributions h2')
          .text()
          .trim()
          .match(/\d+/)?.[0] || 0,
        lastYear: 0, // This would require additional scraping or API call
        streak: parseInt($('.contrib-streak .text-bold').text().trim() || '0')
      };
  
      // Parse contribution calendar
      const contributionCalendar = {};
      $('.js-calendar-graph-svg rect.ContributionCalendar-day').each((i, el) => {
        const date = $(el).attr('data-date');
        const count = parseInt($(el).attr('data-count') || '0');
        if (date && count > 0) {
          contributionCalendar[date] = count;
        }
      });
  
      // Extract repositories with basic details
      const repositories = [];
      
      // Fetch all repository pages (pagination handling)
      let hasNextPage = true;
      let page = 1;
      
      while (hasNextPage && page <= 10) { // Limit to 10 pages to prevent infinite loops
        console.log(`Fetching repositories page ${page}...`);
        
        const reposResponse = await axios.get(
          `https://github.com/${username}?tab=repositories&page=${page}`, 
          { headers: createHeaders() }
        );
        const reposPage = cheerio.load(reposResponse.data);
        
        // Check if there are repositories on this page
        const repoItems = reposPage('#user-repositories-list li');
        if (repoItems.length === 0) {
          hasNextPage = false;
          break;
        }
        
        // Extract repositories from the current page
        repoItems.each((i, repoItem) => {
          const $repoItem = reposPage(repoItem);
          
          const repoName = $repoItem.find('h3 a').text().trim();
          const repoFullName = `${username}/${repoName}`;
          const repoDescription = $repoItem.find('p').text().trim();
          const repoLanguage = $repoItem.find('[itemprop="programmingLanguage"]').text().trim();
          const repoUrl = $repoItem.find('h3 a').attr('href');
          
          // Extract stats (stars, forks, etc.)
          const repoStars = parseInt($repoItem.find('a[href$="/stargazers"]').text().trim().replace(',', '') || '0');
          const repoForks = parseInt($repoItem.find('a[href$="/network/members"]').text().trim().replace(',', '') || '0');
          const repoWatchers = parseInt($repoItem.find('a[href$="/watchers"]').text().trim().replace(',', '') || '0');
          
          // Extract dates
          const updatedAt = $repoItem.find('relative-time').attr('datetime');
          
          // Extract topics/tags
          const topics = [];
          $repoItem.find('a.topic-tag').each((i, topic) => {
            topics.push(reposPage(topic).text().trim());
          });
          
          repositories.push({
            name: repoName,
            fullName: repoFullName,
            description: repoDescription,
            language: repoLanguage,
            stars: repoStars,
            forks: repoForks,
            watchers: repoWatchers,
            url: `https://github.com${repoUrl}`,
            htmlUrl: `https://github.com${repoUrl}`,
            cloneUrl: `https://github.com${repoUrl}.git`,
            sshUrl: `git@github.com:${repoFullName}.git`,
            updatedAt: updatedAt,
            topics: topics,
            isPrivate: false // Assuming all listed repos are public
          });
        });
        
        // Check if there's a next page
        hasNextPage = !!reposPage('.paginate-container a.next_page').length;
        page++;
        
        // Respect GitHub's rate limiting
        if (hasNextPage) {
          await delay(1000); // Wait 1 second between page requests
        }
      }
      
      // Fetch detailed information for each repository with rate limiting
      console.log(`Fetching detailed information for ${repositories.length} repositories...`);
      
      for (let i = 0; i < repositories.length; i++) {
        const repo = repositories[i];
        try {
          console.log(`Fetching details for repository ${i+1}/${repositories.length}: ${repo.name}`);
          
          const repoDetailResponse = await axios.get(`https://github.com/${repo.fullName}`, {
            headers: createHeaders()
          });
          const repoPage = cheerio.load(repoDetailResponse.data);
          
          // Get additional details like open issues, pull requests
          repo.openIssues = parseInt(repoPage('span[data-content="Issues"]').next().text().trim() || '0');
          repo.openPullRequests = parseInt(repoPage('span[data-content="Pull requests"]').next().text().trim() || '0');
          
          // Get primary branch name
          repo.defaultBranch = repoPage('summary[title="Switch branches or tags"] span.css-truncate-target').first().text().trim() || 'main';
          
          // Get README content
          const readmeSelector = '#readme article';
          if (repoPage(readmeSelector).length > 0) {
            repo.hasReadme = true;
            // Store a truncated version to prevent huge response payloads
            const readmeContent = repoPage(readmeSelector).text().trim();
            repo.readmeSummary = readmeContent.substring(0, 300) + (readmeContent.length > 300 ? '...' : '');
          } else {
            repo.hasReadme = false;
          }
          
          // Get license information
          const licenseInfo = repoPage('.BorderGrid-cell a[href$="/blob/main/LICENSE"]').text().trim() || 
                            repoPage('.BorderGrid-cell a[href$="/blob/master/LICENSE"]').text().trim();
          if (licenseInfo) {
            repo.license = licenseInfo;
          }
          
          // Get contributors count
          const contributorsLink = repoPage('a[href$="/graphs/contributors"]');
          if (contributorsLink.length) {
            const contributorsText = contributorsLink.text().trim();
            const contributorsMatch = contributorsText.match(/(\d+)/);
            repo.contributorsCount = contributorsMatch ? parseInt(contributorsMatch[1]) : 0;
          }
          
          // Get last commit information
          repo.lastCommitMessage = repoPage('.commit-title a').text().trim();
          repo.lastCommitSha = repoPage('.commit-tease a.sha').text().trim();
          repo.lastCommitDate = repoPage('.commit-tease relative-time').attr('datetime');
          
          // Attempt to get language statistics
          const languageStats = {};
          repoPage('.BorderGrid-cell div.Progress').each((i, el) => {
            const langEl = repoPage(el);
            const langName = langEl.prev().text().trim();
            const langPercent = parseFloat(langEl.attr('aria-label')?.match(/(\d+\.\d+)%/)?.[1] || '0');
            if (langName && !isNaN(langPercent)) {
              languageStats[langName] = langPercent;
            }
          });
          repo.languageStats = languageStats;
          
          // Wait between requests to avoid rate limiting
          if (i < repositories.length - 1) {
            await delay(1500); // 1.5 seconds between repo detail requests
          }
        } catch (err) {
          console.error(`Failed to fetch details for repo ${repo.name}`, err);
          // Still wait even if there's an error to maintain the rate limit
          if (i < repositories.length - 1) {
            await delay(1500);
          }
        }
      }
  
      // Extract languages from all repositories
      const languages = {};
      repositories.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
        
        // Also include languages from detailed stats if available
        if (repo.languageStats) {
          Object.keys(repo.languageStats).forEach(lang => {
            languages[lang] = (languages[lang] || 0) + 1;
          });
        }
      });
  
      // Calculate total stars
      let totalStars = 0;
      repositories.forEach(repo => {
        totalStars += repo.stars;
      });
  
      return {
        profile: {
          name,
          login,
          bio,
          company,
          location,
          blog,
          avatar,
          htmlUrl,
          createdAt
        },
        stats: {
          followers,
          following,
          publicRepos,
          publicGists,
          totalStars
        },
        contributions: contributionStats,
        contributionCalendar: contributionCalendar,
        repositories: repositories,
        languages: Object.entries(languages)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      };
    } catch (error) {
      console.error('GitHub stats fetch failed', error);
      return null;
    }
  },
  // geeksforgeeks: async (username) => {
  //   try {
  //     const profileUrl = `https://auth.geeksforgeeks.org/user/${username}`;
  //     const response = await axios.get(profileUrl, { headers: createHeaders() });
  //     const $ = cheerio.load(response.data);
      
  //     // Extract basic profile information
  //     const name = $('.profile_name').text().trim();
  //     const institute = $('.profile_college').text().trim();
  //     const ranking = $('.rankNum').text().trim();
  //     const avatar = $('.profile_img img').attr('src');
      
  //     // Extract coding stats
  //     const codingScores = {};
  //     $('.score_card_value').each((index, element) => {
  //       const label = $(element).prev('.score_card_name').text().trim();
  //       const value = $(element).text().trim();
  //       codingScores[label.toLowerCase().replace(/\s+/g, '_')] = value;
  //     });
      
  //     // Extract problem-solving stats
  //     const problemStats = {};
  //     $('.problemSolved_details_container').each((index, element) => {
  //       const category = $(element).find('.problemSolved_heading_container h3').text().trim();
  //       const solvedCount = $(element).find('.solved_problem_container h3').text().trim();
  //       problemStats[category.toLowerCase().replace(/\s+/g, '_')] = solvedCount;
  //     });
      
  //     // Extract badges/achievements
  //     const badges = [];
  //     $('.profile_badge_card').each((index, element) => {
  //       const badgeName = $(element).find('.badge_card_title').text().trim();
  //       const badgeDesc = $(element).find('.badge_card_desc').text().trim();
  //       badges.push({ name: badgeName, description: badgeDesc });
  //     });
      
  //     // Extract contribution stats
  //     const contributions = [];
  //     $('.contribution_card').each((index, element) => {
  //       const title = $(element).find('.contribution_card_title').text().trim();
  //       const link = $(element).find('a').attr('href');
  //       contributions.push({ title, link });
  //     });
      
  //     // Extract monthly activity data for heatmap
  //     const monthlyActivity = {};
  //     $('.profileActivity_Card').each((index, element) => {
  //       const month = $(element).find('.card_heading').text().trim();
  //       const days = [];
  //       $(element).find('.monthActivity_box').each((i, day) => {
  //         const count = parseInt($(day).attr('data-activity-count') || '0');
  //         const date = $(day).attr('data-activity-date') || '';
  //         if (date) {
  //           days.push({ date, count });
  //         }
  //       });
  //       monthlyActivity[month] = days;
  //     });
      
  //     return {
  //       profile: {
  //         name,
  //         institute,
  //         ranking,
  //         avatar
  //       },
  //       codingScores,
  //       problemStats,
  //       badges,
  //       contributions,
  //       monthlyActivity
  //     };
  //   } catch (error) {
  //     console.error('GeeksforGeeks stats fetch failed', error);
  //     return null;
  //   }
  // },

  // Keep other platform stats fetching implementations...
};

// Validation Controller
exports.validateUsernames = async (req, res) => {
  try {
    const usernameValidations = {};
    
    // Dynamically validate usernames for all platforms
    for (const platform of SUPPORTED_PLATFORMS) {
      const username = req.body[platform];
      if (username) {
        const validationStrategy = platformValidationStrategies[platform];
        if (validationStrategy) {
          usernameValidations[platform] = await validationStrategy(username);
        }
      }
    }

    res.json(usernameValidations);
  } catch (error) {
    res.status(500).json({
      message: "Validation error",
      error: error.message
    });
  }
};

// Profile Update Controller
exports.updateUserProfile = async (req, res) => {
  try {
    const { email, ...platformUsernames } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      user = new User({ email, name: req.body.name || 'User' });
    }

    // Update platform usernames with validation
    for (const platform of SUPPORTED_PLATFORMS) {
      if (platformUsernames[platform]) {
        // Validate username before updating
        const validationStrategy = platformValidationStrategies[platform];
        if (validationStrategy) {
          const isValid = await validationStrategy(platformUsernames[platform]);
          if (!isValid) {
            return res.status(400).json({ 
              message: `Invalid ${platform} username` 
            });
          }
        }
        user[platform] = platformUsernames[platform];
      }
    }

    // Save user
    await user.save();

    // Prepare response data
    const updatedPlatforms = {};
    SUPPORTED_PLATFORMS.forEach(platform => {
      if (user[platform]) updatedPlatforms[platform] = user[platform];
    });

    res.json({ 
      message: "Profile updated successfully", 
      user: { 
        email: user.email,
        name: user.name,
        platforms: updatedPlatforms 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Comprehensive Profile Fetching
exports.getUserProfile = async (req, res) => {
  try {
    const { email } = req.query;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch stats for platforms with usernames
    const platformStats = {};
    const missingPlatforms = [];
    
    // Check if required platforms are missing
    ['leetcode', 'github', 'geeksforgeeks'].forEach(platform => {
      if (!user[platform]) {
        missingPlatforms.push(platform);
      }
    });

    const statsPromises = SUPPORTED_PLATFORMS
      .filter(platform => user[platform])
      .map(async (platform) => {
        try {
          const statsStrategy = platformStatsFetching[platform];
          if (statsStrategy) {
            const stats = await statsStrategy(user[platform]);
            return { platform, stats };
          }
        } catch (error) {
          console.error(`Error fetching ${platform} stats`, error);
        }
      });

    // Wait for all stats to be fetched
    const resolvedStats = await Promise.allSettled(statsPromises);

    // Organize stats
    resolvedStats.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        const { platform, stats } = result.value;
        platformStats[platform] = {
          username: user[platform],
          stats
        };
      }
    });

    // Respond with comprehensive user profile
    res.json({
      email: user.email,
      name: user.name,
      missingPlatforms,
      platformStats
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Developer Score Calculation
exports.getDeveloperScore = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const platformScores = {};
    let totalScore = 0;

    // Calculate scores based on platform achievements
    for (const platform of SUPPORTED_PLATFORMS) {
      if (user[platform]) {
        const stats = await platformStatsFetching[platform]?.(user[platform]);
        if (stats) {
          // Custom scoring logic for each platform
          let platformScore = 0;
          switch(platform) {
            case 'leetcode':
              // Calculate score based on problems solved, contest rating and badges
              platformScore = (stats.problemStats?.totalSolved || 0) * 10;
              if (stats.contestStats?.rating) {
                platformScore += Math.min(stats.contestStats.rating, 2000);
              }
              platformScore += (stats.badges?.length || 0) * 50;
              break;
              
            case 'github':
              // Calculate score based on repos, stars, contributions
              platformScore = (stats.stats?.publicRepos || 0) * 5;
              platformScore += (stats.stats?.totalStars || 0) * 10;
              platformScore += (stats.contributions?.total || 0) * 0.5;
              break;
              
            case 'geeksforgeeks':
              // Parse and calculate score based on problem solving and institute ranking
              const solvedProblems = Object.values(stats.problemStats || {})
                .reduce((total, count) => total + parseInt(count || 0), 0);
              platformScore = solvedProblems * 5;
              
              // Add points for coding scores
              const codingScore = parseInt(stats.codingScores?.coding_score || 0);
              if (!isNaN(codingScore)) {
                platformScore += codingScore;
              }
              break;
              
            // Add more platform-specific scoring
          }
          platformScores[platform] = platformScore;
          totalScore += platformScore;
        }
      }
    }

    res.json({
      totalScore,
      platformScores
    });
  } catch (error) {
    res.status(500).json({
      message: "Score calculation error",
      error: error.message
    });
  }
};