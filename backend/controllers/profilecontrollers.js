const axios = require('axios');
const cheerio = require('cheerio');
const User = require('../models/User');

// Supported platforms with improved coverage
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

// Cache configuration - different intervals for different platforms
const CACHE_DURATION = {
  github: 6 * 60 * 60 * 1000, // 6 hours for GitHub (slower changing data)
  leetcode: 2 * 60 * 60 * 1000, // 2 hours for LeetCode
  geeksforgeeks: 4 * 60 * 60 * 1000, // 4 hours for GeeksforGeeks
  codechef: 4 * 60 * 60 * 1000, // 4 hours for CodeChef
  codeforces: 2 * 60 * 60 * 1000, // 2 hours for Codeforces
  hackerrank: 4 * 60 * 60 * 1000, // 4 hours for HackerRank
  hackerearth: 4 * 60 * 60 * 1000, // 4 hours for HackerEarth
  kaggle: 6 * 60 * 60 * 1000, // 6 hours for Kaggle
  topcoder: 6 * 60 * 60 * 1000, // 6 hours for TopCoder
  atcoder: 4 * 60 * 60 * 1000, // 4 hours for AtCoder
  spoj: 6 * 60 * 60 * 1000 // 6 hours for SPOJ
};

// Utility function for creating custom headers
const createHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
});

// Cache management utilities
const isCacheValid = (cacheEntry, platform) => {
  if (!cacheEntry || !cacheEntry.lastUpdated) return false;
  const cacheAge = Date.now() - new Date(cacheEntry.lastUpdated).getTime();
  return cacheAge < (CACHE_DURATION[platform] || 4 * 60 * 60 * 1000);
};

const getCachedData = async (userId, platform) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.platformStatsCache) return null;
    
    const cacheEntry = user.platformStatsCache.get(platform);
    if (isCacheValid(cacheEntry, platform)) {
      console.log(`Using cached data for ${platform}`);
      return cacheEntry.data;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

const setCachedData = async (userId, platform, data) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    
    if (!user.platformStatsCache) {
      user.platformStatsCache = new Map();
    }
    
    user.platformStatsCache.set(platform, {
      data: data,
      lastUpdated: new Date()
    });
    
    await user.save();
    console.log(`Cached data for ${platform}`);
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

// Enhanced platform validation strategies
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
        headers: createHeaders(),
        timeout: 10000
      });
      return !!graphqlResponse.data.data.matchedUser;
    } catch (error) {
      try {
        const profileUrl = `https://leetcode.com/${username}`;
        const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
        const $ = cheerio.load(response.data);
        return $('.user-profile-name').length > 0 || $('[data-cy="user-profile"]').length > 0;
      } catch {
        return false;
      }
    }
  },
  
  github: async (username) => {
    try {
      const response = await axios.get(`https://github.com/${username}`, {
        headers: createHeaders(),
        timeout: 10000
      });
      return response.status === 200;
    } catch {
      return false;
    }
  },

  geeksforgeeks: async (username) => {
    try {
      // Try different possible URLs and methods
      const urls = [
        `https://auth.geeksforgeeks.org/user/${username}`,
        `https://www.geeksforgeeks.org/user/${username}`,
        `https://auth.geeksforgeeks.org/user/${username}/profile`
      ];
      
      for (const profileUrl of urls) {
        try {
          console.log(`Trying GeeksforGeeks URL: ${profileUrl}`);
          
          const response = await axios.get(profileUrl, { 
            headers: {
              ...createHeaders(),
              'Referer': 'https://www.geeksforgeeks.org/',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }, 
            timeout: 15000,
            validateStatus: function (status) {
              return status < 500; // Accept any status code less than 500
            }
          });
          
          if (response.status === 200) {
            const $ = cheerio.load(response.data);
            
            // Multiple selectors to check for profile existence
            const profileIndicators = [
              $('.profile_name').length > 0,
              $('.profilePicSection').length > 0,
              $('.profile-container').length > 0,
              $('.user-profile').length > 0,
              $('.profile-info').length > 0,
              $('.profile_pic').length > 0,
              $('div[class*="profile"]').length > 0,
              $('.user-details').length > 0,
              $('.user-info').length > 0,
              // Check if page title contains the username
              $('title').text().toLowerCase().includes(username.toLowerCase()),
              // Check for any text that might indicate a valid profile
              $.text().toLowerCase().includes('profile') && $.text().toLowerCase().includes(username.toLowerCase())
            ];
            
            console.log(`GeeksforGeeks profile indicators for ${username}:`, profileIndicators);
            
            if (profileIndicators.some(indicator => indicator)) {
              console.log(`GeeksforGeeks profile found for ${username} at ${profileUrl}`);
              return true;
            }
            
            // Additional check - if the page doesn't contain "user not found" or similar error messages
            const errorMessages = [
              'user not found',
              'profile not found',
              'does not exist',
              'user does not exist',
              'invalid user',
              '404',
              'not found'
            ];
            
            const pageText = $.text().toLowerCase();
            const hasErrorMessage = errorMessages.some(msg => pageText.includes(msg));
            
            if (!hasErrorMessage && pageText.includes(username.toLowerCase())) {
              console.log(`GeeksforGeeks profile likely exists for ${username} (no error messages found)`);
              return true;
            }
          }
        } catch (urlError) {
          console.log(`Failed to fetch ${profileUrl}:`, urlError.message);
          continue;
        }
      }
      
      console.log(`GeeksforGeeks profile not found for ${username}`);
      return false;
    } catch (error) {
      console.error('GeeksforGeeks validation error:', error.message);
      return false;
    }
  },

  hackerrank: async (username) => {
    try {
      // Try different possible URLs for HackerRank
      const urls = [
        `https://www.hackerrank.com/profile/${username}`,
        `https://www.hackerrank.com/${username}`,
        `https://www.hackerrank.com/users/${username}`
      ];
      
      for (const profileUrl of urls) {
        try {
          console.log(`Trying HackerRank URL: ${profileUrl}`);
          
          const response = await axios.get(profileUrl, { 
            headers: {
              ...createHeaders(),
              'Referer': 'https://www.hackerrank.com/',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }, 
            timeout: 15000,
            validateStatus: function (status) {
              return status < 500; // Accept any status code less than 500
            }
          });
          
          if (response.status === 200) {
            const $ = cheerio.load(response.data);
            
            // Multiple selectors to check for profile existence
            const profileIndicators = [
              $('.profile-username').length > 0,
              $('[data-testid="profile-header"]').length > 0,
              $('.profile-header').length > 0,
              $('.user-profile').length > 0,
              $('.profile-card').length > 0,
              $('.profile-details').length > 0,
              $('.user-header').length > 0,
              $('.profile-info').length > 0,
              // Check page title
              $('title').text().toLowerCase().includes(username.toLowerCase()),
              // Check for username in the page
              $.text().toLowerCase().includes(username.toLowerCase()) && $.text().toLowerCase().includes('hackerrank')
            ];
            
            console.log(`HackerRank profile indicators for ${username}:`, profileIndicators);
            
            if (profileIndicators.some(indicator => indicator)) {
              console.log(`HackerRank profile found for ${username} at ${profileUrl}`);
              return true;
            }
            
            // Check if page doesn't contain error messages
            const errorMessages = [
              'user not found',
              'profile not found',
              'does not exist',
              'user does not exist',
              'invalid user',
              '404',
              'not found',
              'page not found'
            ];
            
            const pageText = $.text().toLowerCase();
            const hasErrorMessage = errorMessages.some(msg => pageText.includes(msg));
            
            if (!hasErrorMessage && pageText.includes(username.toLowerCase())) {
              console.log(`HackerRank profile likely exists for ${username} (no error messages found)`);
              return true;
            }
          }
        } catch (urlError) {
          console.log(`Failed to fetch ${profileUrl}:`, urlError.message);
          continue;
        }
      }
      
      console.log(`HackerRank profile not found for ${username}`);
      return false;
    } catch (error) {
      console.error('HackerRank validation error:', error.message);
      return false;
    }
  },

  codechef: async (username) => {
    try {
      // Try different possible URLs for CodeChef
      const urls = [
        `https://www.codechef.com/users/${username}`,
        `https://www.codechef.com/users/${username}/`
      ];
      
      for (const profileUrl of urls) {
        try {
          console.log(`Trying CodeChef URL: ${profileUrl}`);
          
          const response = await axios.get(profileUrl, { 
            headers: {
              ...createHeaders(),
              'Referer': 'https://www.codechef.com/',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }, 
            timeout: 15000,
            validateStatus: function (status) {
              return status < 500; // Accept any status code less than 500
            }
          });
          
          if (response.status === 200) {
            const $ = cheerio.load(response.data);
            
            // Multiple selectors to check for profile existence
            const profileIndicators = [
              $('.user-details-container').length > 0,
              $('.user-profile').length > 0,
              $('.profile-header').length > 0,
              $('.user-header').length > 0,
              $('.profile-container').length > 0,
              $('.user-info').length > 0,
              $('.rating-header').length > 0,
              $('.user-details').length > 0,
              // Check for username display
              $('.username').text().toLowerCase().includes(username.toLowerCase()),
              // Check page title
              $('title').text().toLowerCase().includes(username.toLowerCase()),
              // Check for username in the page content
              $.text().toLowerCase().includes(username.toLowerCase()) && !$.text().toLowerCase().includes('user not found')
            ];
            
            console.log(`CodeChef profile indicators for ${username}:`, profileIndicators);
            
            if (profileIndicators.some(indicator => indicator)) {
              console.log(`CodeChef profile found for ${username} at ${profileUrl}`);
              return true;
            }
            
            // Check if page doesn't contain error messages
            const errorMessages = [
              'user not found',
              'profile not found',
              'does not exist',
              'user does not exist',
              'invalid user',
              '404',
              'not found',
              'user not exist',
              'invalid username'
            ];
            
            const pageText = $.text().toLowerCase();
            const hasErrorMessage = errorMessages.some(msg => pageText.includes(msg));
            
            if (!hasErrorMessage && pageText.includes(username.toLowerCase())) {
              console.log(`CodeChef profile likely exists for ${username} (no error messages found)`);
              return true;
            }
          }
        } catch (urlError) {
          console.log(`Failed to fetch ${profileUrl}:`, urlError.message);
          continue;
        }
      }
      
      console.log(`CodeChef profile not found for ${username}`);
      return false;
    } catch (error) {
      console.error('CodeChef validation error:', error.message);
      return false;
    }
  },

  codeforces: async (username) => {
    try {
      const profileUrl = `https://codeforces.com/profile/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
      const $ = cheerio.load(response.data);
      return $('.main-info').length > 0 || $('.user-info').length > 0;
    } catch {
      return false;
    }
  },

  hackerearth: async (username) => {
    try {
      const profileUrl = `https://www.hackerearth.com/@${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
      const $ = cheerio.load(response.data);
      return $('.profile-header').length > 0 || $('.user-profile').length > 0;
    } catch {
      return false;
    }
  },

  kaggle: async (username) => {
    try {
      const profileUrl = `https://www.kaggle.com/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
      const $ = cheerio.load(response.data);
      return $('.profile-header').length > 0 || $('[data-testid="user-profile"]').length > 0;
    } catch {
      return false;
    }
  },

  topcoder: async (username) => {
    try {
      const profileUrl = `https://www.topcoder.com/members/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
      const $ = cheerio.load(response.data);
      return $('.profile-info').length > 0 || $('.member-profile').length > 0;
    } catch {
      return false;
    }
  },

  atcoder: async (username) => {
    try {
      const profileUrl = `https://atcoder.jp/users/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
      const $ = cheerio.load(response.data);
      return $('.user-icon').length > 0 || $('.user-name').length > 0;
    } catch {
      return false;
    }
  },

  spoj: async (username) => {
    try {
      const profileUrl = `https://www.spoj.com/users/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
      const $ = cheerio.load(response.data);
      return $('.profile-info').length > 0 || $('.profile-header').length > 0;
    } catch {
      return false;
    }
  }
};

// Enhanced platform stats fetching strategies with caching
const platformStatsFetching = {
  leetcode: async (username, userId = null) => {
    try {
      // Check cache first
      if (userId) {
        const cachedData = await getCachedData(userId, 'leetcode');
        if (cachedData) return cachedData;
      }

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
      }, { headers: createHeaders(), timeout: 15000 });

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
      }, { headers: createHeaders(), timeout: 15000 });

      const calendarData = calendarResponse.data.data.matchedUser.userCalendar;
      
      // Process submission stats
      const submitStats = userData.submitStats.acSubmissionNum;
      const totalSubmitStats = userData.submitStats.totalSubmissionNum;

      const result = {
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
        contestHistory: contestHistory.map(item => {
          try {
            const startTime = item.contest?.startTime;
            let dateStr = null;
            
            if (startTime) {
              const timestamp = typeof startTime === 'number' ? 
                (startTime > 1e10 ? startTime : startTime * 1000) : 
                new Date(startTime).getTime();
              
              if (!isNaN(timestamp)) {
                dateStr = new Date(timestamp).toISOString().split('T')[0];
              }
            }
            
            return {
              title: item.contest?.title || '',
              date: dateStr,
              rating: item.rating || 0,
              ranking: item.ranking || 0,
              attended: item.attended || false
            };
          } catch (error) {
            console.warn('Error processing contest history item:', error);
            return {
              title: item.contest?.title || '',
              date: null,
              rating: item.rating || 0,
              ranking: item.ranking || 0,
              attended: item.attended || false
            };
          }
        }).filter(item => item.date !== null),
        badges: userData.badges || [],
        calendar: {
          activeYears: calendarData?.activeYears || [],
          streak: calendarData?.streak || 0,
          totalActiveDays: calendarData?.totalActiveDays || 0,
          submissionCalendar: calendarData?.submissionCalendar ? 
            JSON.parse(calendarData.submissionCalendar) : {}
        }
      };

      // Cache the result
      if (userId) {
        await setCachedData(userId, 'leetcode', result);
      }

      return result;
    } catch (error) {
      console.error('LeetCode stats fetch failed', error);
      return null;
    }
  },

  github: async (username, userId = null) => {
    try {
      // Check cache first
      if (userId) {
        const cachedData = await getCachedData(userId, 'github');
        if (cachedData) return cachedData;
      }

      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Fetch the GitHub profile page
      const profileResponse = await axios.get(`https://github.com/${username}`, { 
        headers: createHeaders(),
        timeout: 15000
      });
      const $ = cheerio.load(profileResponse.data);

      // Extract basic profile information with improved selectors
      const name = $('h1.vcard-names .p-name, .h-card .p-name, .vcard-fullname').text().trim();
      const login = $('span.p-nickname, .p-nickname, .vcard-username').text().trim();
      const bio = $('div.p-note.user-profile-bio, .user-profile-bio, .p-note div').text().trim();
      const company = $('li[itemprop="worksFor"], .p-org, .vcard-detail[itemprop="worksFor"]').text().trim();
      const location = $('li[itemprop="homeLocation"], .p-label, .vcard-detail[itemprop="homeLocation"]').first().text().trim();
      const blog = $('li[itemprop="url"] a, .p-label a, .vcard-detail[itemprop="url"] a').first().attr('href');
      const avatar = $('img.avatar.avatar-user, .avatar, .avatar-user').attr('src');
      const htmlUrl = `https://github.com/${username}`;
      const createdAt = $('li.p-label relative-time, relative-time, .vcard-detail relative-time').attr('datetime');

      // Extract stats with multiple selector strategies
      let followers = 0;
      let following = 0;
      let publicRepos = 0;

      // Try multiple selectors for followers
      const followerSelectors = [
        'a[href$="/followers"] .text-bold',
        'a[href$="/followers"] .Counter',
        'a[href$="/followers"] span',
        '.vcard-stat:contains("followers") .vcard-stat-count',
        '[data-tab-item="followers"] .Counter'
      ];
      
      for (const selector of followerSelectors) {
        const text = $(selector).text().trim();
        if (text) {
          followers = parseInt(text.replace(/[^\d]/g, '')) || 0;
          if (followers > 0) break;
        }
      }

      // Try multiple selectors for following
      const followingSelectors = [
        'a[href$="/following"] .text-bold',
        'a[href$="/following"] .Counter', 
        'a[href$="/following"] span',
        '.vcard-stat:contains("following") .vcard-stat-count',
        '[data-tab-item="following"] .Counter'
      ];
      
      for (const selector of followingSelectors) {
        const text = $(selector).text().trim();
        if (text) {
          following = parseInt(text.replace(/[^\d]/g, '')) || 0;
          if (following > 0) break;
        }
      }

      // Try multiple selectors for repositories
      const repoSelectors = [
        'nav a[href$="?tab=repositories"] .Counter',
        '.UnderlineNav-item[data-tab-item="repositories"] .Counter',
        '.vcard-stat:contains("repositories") .vcard-stat-count',
        'a[data-tab-item="repositories"] .Counter'
      ];
      
      for (const selector of repoSelectors) {
        const text = $(selector).text().trim();
        if (text) {
          publicRepos = parseInt(text.replace(/[^\d]/g, '')) || 0;
          if (publicRepos > 0) break;
        }
      }

      // Extract contribution stats with improved selectors and streak calculation
      let totalContributions = 0;
      let currentStreak = 0;
      
      // Try multiple selectors for contributions
      const contributionSelectors = [
        '.js-yearly-contributions h2',
        '.ContributionCalendar h2',
        '.contrib-column .contrib-number',
        '.js-contribution-graph h2'
      ];
      
      for (const selector of contributionSelectors) {
        const text = $(selector).text().trim();
        const match = text.match(/[\d,]+/);
        if (match) {
          totalContributions = parseInt(match[0].replace(',', '')) || 0;
          if (totalContributions > 0) break;
        }
      }

      // Parse contribution calendar with improved selectors and calculate streak
      const contributionCalendar = {};
      const contributionData = [];
      
      $('.ContributionCalendar-day, .js-calendar-graph rect, .ContributionCalendar rect').each((i, el) => {
        const date = $(el).attr('data-date');
        const count = parseInt($(el).attr('data-level') || $(el).attr('data-count') || '0');
        if (date) {
          contributionCalendar[date] = count;
          contributionData.push({ date: new Date(date), count });
        }
      });

      // Calculate current streak
      if (contributionData.length > 0) {
        contributionData.sort((a, b) => b.date - a.date); // Sort by date descending
        const today = new Date();
        let streakCount = 0;
        
        for (const contrib of contributionData) {
          const daysDiff = Math.floor((today - contrib.date) / (1000 * 60 * 60 * 24));
          
          // Only count days within the last year and consecutive days with contributions
          if (daysDiff <= 365) {
            if (contrib.count > 0) {
              if (daysDiff === streakCount) {
                streakCount++;
              } else if (daysDiff === streakCount + 1) {
                streakCount++;
              } else {
                break;
              }
            } else if (daysDiff === streakCount) {
              // Allow one day gap
              streakCount++;
            } else {
              break;
            }
          }
        }
        currentStreak = streakCount;
      }

      const contributionStats = {
        total: totalContributions,
        streak: currentStreak,
        thisYear: totalContributions // Assuming the total is for this year
      };

      // Optimized repository fetching (limited to first 30 for performance)
      const repositories = [];
      console.log(`Fetching repositories for ${username}...`);
      
      const reposResponse = await axios.get(
        `https://github.com/${username}?tab=repositories&type=source`, 
        { headers: createHeaders(), timeout: 15000 }
      );
      const reposPage = cheerio.load(reposResponse.data);
      
      // Extract repositories from the current page (limit to 30 for performance)
      reposPage('#user-repositories-list li, .user-repo-search-results li').slice(0, 30).each((i, repoItem) => {
        const $repoItem = reposPage(repoItem);
        
        const repoName = $repoItem.find('h3 a, .repo-list-name a').text().trim();
        if (!repoName) return;
        
        const repoFullName = `${username}/${repoName}`;
        const repoDescription = $repoItem.find('p, .repo-list-description').text().trim();
        const repoLanguage = $repoItem.find('[itemprop="programmingLanguage"], .repo-language-color + span').text().trim();
        const repoUrl = $repoItem.find('h3 a, .repo-list-name a').attr('href');
        
        // Extract stats (stars, forks, etc.)
        const repoStars = parseInt($repoItem.find('a[href$="/stargazers"], .octicon-star').parent().text().trim().replace(/[^\d]/g, '') || '0');
        const repoForks = parseInt($repoItem.find('a[href$="/forks"], .octicon-repo-forked').parent().text().trim().replace(/[^\d]/g, '') || '0');
        
        // Extract dates
        const updatedAt = $repoItem.find('relative-time').attr('datetime');
        
        repositories.push({
          name: repoName,
          fullName: repoFullName,
          description: repoDescription,
          language: repoLanguage,
          stars: repoStars,
          forks: repoForks,
          url: `https://github.com${repoUrl}`,
          htmlUrl: `https://github.com${repoUrl}`,
          updatedAt: updatedAt,
          isPrivate: false
        });
      });

      // Extract languages from repositories
      const languages = {};
      repositories.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      // Calculate total stars
      let totalStars = 0;
      repositories.forEach(repo => {
        totalStars += repo.stars;
      });

      const result = {
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
          totalStars
        },
        contributions: contributionStats,
        contributionCalendar: contributionCalendar,
        repositories: repositories,
        languages: Object.entries(languages)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      };

      // Cache the result
      if (userId) {
        await setCachedData(userId, 'github', result);
      }

      return result;
    } catch (error) {
      console.error('GitHub stats fetch failed', error);
      return null;
    }
  },

  geeksforgeeks: async (username, userId = null) => {
    try {
      // Check cache first
      if (userId) {
        const cachedData = await getCachedData(userId, 'geeksforgeeks');
        if (cachedData) return cachedData;
      }

      // Try different possible URLs
      const urls = [
        `https://auth.geeksforgeeks.org/user/${username}`,
        `https://www.geeksforgeeks.org/user/${username}`,
        `https://auth.geeksforgeeks.org/user/${username}/profile`
      ];
      
      let profileData = null;
      
      for (const profileUrl of urls) {
        try {
          console.log(`Trying GeeksforGeeks stats URL: ${profileUrl}`);
          
          const response = await axios.get(profileUrl, { 
            headers: {
              ...createHeaders(),
              'Referer': 'https://www.geeksforgeeks.org/',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }, 
            timeout: 15000 
          });
          
          if (response.status === 200) {
            const $ = cheerio.load(response.data);
            
            // Extract profile information using specific selectors based on actual GFG HTML structure
            const name = $('.userName').first().text().trim() || 
                         $('.profile_name').first().text().trim() || 
                         username;
            
            const institute = $('.userTxt').first().text().trim() || 
                             $('.profile_institute').first().text().trim();
            
            // Extract avatar image
            const avatar = $('.profilePicSection img').first().attr('src') || 
                          $('.profile_img img').first().attr('src');
            
            // Extract contest rating and ranking
            let contestRating = '';
            let currentRank = '';
            let maxRating = '';
            
            // Look for contest data in script tags or data attributes
            const scriptTags = $('script').toArray();
            for (const script of scriptTags) {
              const scriptContent = $(script).html();
              if (scriptContent && scriptContent.includes('contestData')) {
                // Extract contest rating from script content
                const ratingMatch = scriptContent.match(/current_rating['"]\s*:\s*(\d+)/);
                if (ratingMatch) {
                  contestRating = ratingMatch[1];
                }
                
                const rankMatch = scriptContent.match(/current_rank['"]\s*:\s*(\d+)/);
                if (rankMatch) {
                  currentRank = rankMatch[1];
                }
                
                const maxRatingMatch = scriptContent.match(/max_rating['"]\s*:\s*(\d+)/);
                if (maxRatingMatch) {
                  maxRating = maxRatingMatch[1];
                }
                break;
              }
            }
            
            // Extract submissions data
            let totalSubmissions = 0;
            let acceptedSubmissions = 0;
            
            // Look for submissions data in script tags
            for (const script of scriptTags) {
              const scriptContent = $(script).html();
              if (scriptContent && scriptContent.includes('userSubmissionsInfo')) {
                // Extract total submissions
                const totalMatch = scriptContent.match(/total['"]\s*:\s*(\d+)/);
                if (totalMatch) {
                  totalSubmissions = parseInt(totalMatch[1]);
                }
                
                // Extract accepted submissions (look for accuracy or accepted count)
                const accuracyMatch = scriptContent.match(/accuracy['"]\s*:\s*([\d.]+)/);
                if (accuracyMatch && totalSubmissions > 0) {
                  const accuracy = parseFloat(accuracyMatch[1]);
                  acceptedSubmissions = Math.round((accuracy / 100) * totalSubmissions);
                }
                break;
              }
            }
            
            // Extract problem solving stats
            const problemStats = {};
            let totalSolved = 0;
            
            // Look for problem categories data
            $('.problemSolved_details_container').each((index, element) => {
              const $el = $(element);
              const category = $el.find('.problemSolved_heading_container h3').text().trim();
              const solvedCount = $el.find('.solved_problem_container h3').text().trim();
              if (category && solvedCount) {
                const count = parseInt(solvedCount) || 0;
                problemStats[category.toLowerCase().replace(/\s+/g, '_')] = count;
                totalSolved += count;
              }
            });
            
            // If no specific categories found, try to extract total from script
            if (totalSolved === 0) {
              for (const script of scriptTags) {
                const scriptContent = $(script).html();
                if (scriptContent && scriptContent.includes('problems_solved')) {
                  const solvedMatch = scriptContent.match(/problems_solved['"]\s*:\s*(\d+)/);
                  if (solvedMatch) {
                    totalSolved = parseInt(solvedMatch[1]);
                    problemStats.total_problems = totalSolved;
                    break;
                  }
                }
              }
            }
            
            // Extract badges and achievements
            const badges = [];
            $('.profile_badge_card').each((index, element) => {
              const $el = $(element);
              const badgeName = $el.find('.badge_card_title').text().trim();
              const badgeDesc = $el.find('.badge_card_desc').text().trim();
              if (badgeName) {
                badges.push({ 
                  name: badgeName, 
                  description: badgeDesc,
                  type: 'achievement'
                });
              }
            });
            
            // Extract streak information
            let currentStreak = '';
            let maxStreak = '';
            
            for (const script of scriptTags) {
              const scriptContent = $(script).html();
              if (scriptContent && scriptContent.includes('streak')) {
                const currentStreakMatch = scriptContent.match(/current_streak['"]\s*:\s*(\d+)/);
                if (currentStreakMatch) {
                  currentStreak = currentStreakMatch[1];
                }
                
                const maxStreakMatch = scriptContent.match(/max_streak['"]\s*:\s*(\d+)/);
                if (maxStreakMatch) {
                  maxStreak = maxStreakMatch[1];
                }
                break;
              }
            }
            
            // Build comprehensive coding scores object
            const codingScores = {};
            if (contestRating) codingScores.contest_rating = contestRating;
            if (currentRank) codingScores.current_rank = currentRank;
            if (maxRating) codingScores.max_rating = maxRating;
            if (currentStreak) codingScores.current_streak = currentStreak;
            if (maxStreak) codingScores.max_streak = maxStreak;
            if (totalSubmissions > 0) codingScores.total_submissions = totalSubmissions.toString();
            if (acceptedSubmissions > 0) codingScores.accepted_submissions = acceptedSubmissions.toString();
            
            // Check if we found meaningful data
            if (name !== username || Object.keys(codingScores).length > 0 || 
                Object.keys(problemStats).length > 0 || badges.length > 0 || totalSolved > 0) {
              
              profileData = {
                profile: {
                  name: name || username,
                  institute: institute || '',
                  ranking: currentRank || '',
                  avatar: avatar || null
                },
                codingScores,
                problemStats,
                badges,
                totalSolved,
                submissions: {
                  total: totalSubmissions,
                  accepted: acceptedSubmissions,
                  accuracy: totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2) : '0'
                },
                contest: {
                  rating: contestRating || '0',
                  maxRating: maxRating || '0',
                  rank: currentRank || '0'
                },
                streak: {
                  current: currentStreak || '0',
                  max: maxStreak || '0'
                },
                connected: true
              };
              
              console.log(`GeeksforGeeks comprehensive stats found for ${username} at ${profileUrl}`);
              console.log('Extracted data:', JSON.stringify(profileData, null, 2));
              break;
            }
          }
        } catch (urlError) {
          console.log(`Failed to fetch GeeksforGeeks stats from ${profileUrl}:`, urlError.message);
          continue;
        }
      }
      
      // If no data found, create a basic profile
      if (!profileData) {
        profileData = {
          profile: {
            name: username,
            institute: '',
            ranking: '',
            avatar: null
          },
          codingScores: {},
          problemStats: {},
          badges: [],
          totalSolved: 0,
          submissions: { total: 0, accepted: 0, accuracy: '0' },
          contest: { rating: '0', maxRating: '0', rank: '0' },
          streak: { current: '0', max: '0' },
          connected: true
        };
      }

      // Cache the result
      if (userId) {
        await setCachedData(userId, 'geeksforgeeks', profileData);
      }

      return profileData;
    } catch (error) {
      console.error('GeeksforGeeks stats fetch failed', error);
      // Return basic profile even on error
      return {
        profile: {
          name: username,
          institute: '',
          ranking: '',
          avatar: null
        },
        codingScores: {},
        problemStats: {},
        badges: [],
        totalSolved: 0,
        submissions: { total: 0, accepted: 0, accuracy: '0' },
        contest: { rating: '0', maxRating: '0', rank: '0' },
        streak: { current: '0', max: '0' },
        connected: true,
        error: error.message
      };
    }
  },

  codechef: async (username, userId = null) => {
    try {
      // Check cache first
      if (userId) {
        const cachedData = await getCachedData(userId, 'codechef');
        if (cachedData) return cachedData;
      }

      const profileUrl = `https://www.codechef.com/users/${username}`;
      console.log(`Fetching CodeChef stats for ${username} from ${profileUrl}`);
      
      const response = await axios.get(profileUrl, { 
        headers: {
          ...createHeaders(),
          'Referer': 'https://www.codechef.com/',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        }, 
        timeout: 15000 
      });
      
      const $ = cheerio.load(response.data);
      
      // Extract profile information with multiple selectors
      let name = '';
      const nameSelectors = [
        '.user-details-container .user-name',
        '.user-name',
        '.profile-name',
        '.username',
        '.user-header .name',
        '.profile-header .name'
      ];
      
      for (const selector of nameSelectors) {
        const element = $(selector);
        if (element.length > 0 && element.text().trim()) {
          name = element.text().trim();
          break;
        }
      }
      
      let country = '';
      const countrySelectors = [
        '.user-details-container .user-country-name',
        '.user-country-name',
        '.country',
        '.user-country',
        '.profile-country'
      ];
      
      for (const selector of countrySelectors) {
        const element = $(selector);
        if (element.length > 0 && element.text().trim()) {
          country = element.text().trim();
          break;
        }
      }
      
      let avatar = '';
      const avatarSelectors = [
        '.user-image img',
        '.user-avatar img',
        '.profile-image img',
        '.avatar img',
        '.user-photo img'
      ];
      
      for (const selector of avatarSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          avatar = element.attr('src') || '';
          if (avatar) break;
        }
      }
      
      // Extract ratings with multiple selectors
      let currentRating = 0;
      let highestRating = 0;
      
      const ratingSelectors = [
        '.rating-number',
        '.rating',
        '.user-rating',
        '.rating-header .rating',
        '.profile-rating',
        '.current-rating'
      ];
      
      const ratingElements = $(ratingSelectors.join(', '));
      if (ratingElements.length > 0) {
        currentRating = parseInt(ratingElements.first().text().trim()) || 0;
        if (ratingElements.length > 1) {
          highestRating = parseInt(ratingElements.eq(1).text().trim()) || currentRating;
        }
      }
      
      // Extract rankings with multiple selectors
      let globalRank = 0;
      let countryRank = 0;
      
      const rankSelectors = [
        '.rank-number',
        '.ranking',
        '.user-rank',
        '.rank',
        '.global-rank',
        '.country-rank'
      ];
      
      const rankElements = $(rankSelectors.join(', '));
      if (rankElements.length > 0) {
        globalRank = parseInt(rankElements.first().text().trim().replace(/\D/g, '')) || 0;
        if (rankElements.length > 1) {
          countryRank = parseInt(rankElements.eq(1).text().trim().replace(/\D/g, '')) || 0;
        }
      }
      
      // Extract problem stats with multiple selectors
      let problemsFullySolved = 0;
      let problemsPartiallySolved = 0;
      
      const problemSelectors = [
        '.problems-solved .prob-comp-solved',
        '.prob-comp-solved',
        '.fully-solved',
        '.problems-fully-solved',
        '.solved-count'
      ];
      
      for (const selector of problemSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          problemsFullySolved = parseInt(element.text().trim()) || 0;
          if (problemsFullySolved > 0) break;
        }
      }
      
      const partialSelectors = [
        '.problems-solved .prob-partially-solved',
        '.prob-partially-solved',
        '.partially-solved',
        '.problems-partially-solved',
        '.partial-count'
      ];
      
      for (const selector of partialSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          problemsPartiallySolved = parseInt(element.text().trim()) || 0;
          if (problemsPartiallySolved > 0) break;
        }
      }
      
      // Extract additional stats
      let contests = 0;
      const contestSelectors = [
        '.contests-participated',
        '.contest-count',
        '.total-contests',
        '.user-contests'
      ];
      
      for (const selector of contestSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          contests = parseInt(element.text().trim().replace(/\D/g, '')) || 0;
          if (contests > 0) break;
        }
      }
      
      let stars = 0;
      const starSelectors = [
        '.rating-star',
        '.star-rating',
        '.stars',
        '.user-stars'
      ];
      
      for (const selector of starSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          stars = element.find('*').length || parseInt(element.text().trim()) || 0;
          if (stars > 0) break;
        }
      }
      
      const result = {
        platform: 'CodeChef',
        username,
        profile: {
          name: name || username,
          country: country || 'N/A',
          avatar: avatar || ''
        },
        ratings: {
          current: currentRating,
          highest: highestRating || currentRating
        },
        rankings: {
          global: globalRank,
          country: countryRank
        },
        problemStats: {
          fullySolved: problemsFullySolved,
          partiallySolved: problemsPartiallySolved,
          totalSolved: problemsFullySolved + problemsPartiallySolved
        },
        additionalStats: {
          contests,
          stars
        },
        profileUrl,
        lastUpdated: new Date().toISOString()
      };

      console.log(`CodeChef stats extracted for ${username}:`, result);

      // Cache the result
      if (userId) {
        await setCachedData(userId, 'codechef', result);
      }

      return result;
    } catch (error) {
      console.error(`Error fetching CodeChef stats for ${username}:`, error.message);
      return {
        platform: 'CodeChef',
        username,
        error: error.message,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  codeforces: async (username, userId = null) => {
    try {
      // Check cache first
      if (userId) {
        const cachedData = await getCachedData(userId, 'codeforces');
        if (cachedData) return cachedData;
      }

      // Use Codeforces API
      const apiResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`, {
        timeout: 15000
      });
      
      if (apiResponse.data.status === 'OK') {
        const user = apiResponse.data.result[0];
        
        // Get user submissions for additional stats
        const submissionsResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=1000`, {
          timeout: 15000
        });
        
        let solvedProblems = new Set();
        let totalSubmissions = 0;
        
        if (submissionsResponse.data.status === 'OK') {
          const submissions = submissionsResponse.data.result;
          totalSubmissions = submissions.length;
          
          submissions.forEach(submission => {
            if (submission.verdict === 'OK') {
              solvedProblems.add(`${submission.problem.contestId}-${submission.problem.index}`);
            }
          });
        }

        const result = {
          profile: {
            handle: user.handle,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            country: user.country || '',
            city: user.city || '',
            titlePhoto: user.titlePhoto || '',
            avatar: user.avatar || ''
          },
          ratings: {
            current: user.rating || 0,
            max: user.maxRating || 0,
            rank: user.rank || 'unrated',
            maxRank: user.maxRank || 'unrated'
          },
          stats: {
            problemsSolved: solvedProblems.size,
            totalSubmissions: totalSubmissions,
            contribution: user.contribution || 0,
            friendOfCount: user.friendOfCount || 0
          }
        };

        // Cache the result
        if (userId) {
          await setCachedData(userId, 'codeforces', result);
        }

        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Codeforces stats fetch failed', error);
      return null;
    }
  },

  hackerrank: async (username, userId = null) => {
    try {
      // Check cache first
      if (userId) {
        const cachedData = await getCachedData(userId, 'hackerrank');
        if (cachedData) return cachedData;
      }

      const profileUrl = `https://www.hackerrank.com/profile/${username}`;
      console.log(`Fetching HackerRank stats for ${username} from ${profileUrl}`);
      
      const response = await axios.get(profileUrl, { 
        headers: {
          ...createHeaders(),
          'Referer': 'https://www.hackerrank.com/',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        }, 
        timeout: 15000 
      });
      
      const $ = cheerio.load(response.data);
      
      // Extract profile information with multiple selectors
      let name = '';
      const nameSelectors = [
        '.profile-username',
        '.username',
        '.profile-name',
        '.user-name',
        '.profile-header .name',
        '.hacker-name',
        '.profile-title'
      ];
      
      for (const selector of nameSelectors) {
        const element = $(selector);
        if (element.length > 0 && element.text().trim()) {
          name = element.text().trim();
          break;
        }
      }
      
      let avatar = '';
      const avatarSelectors = [
        '.profile-avatar img',
        '.user-avatar img',
        '.profile-image img',
        '.avatar img',
        '.profile-photo img',
        '.hacker-avatar img'
      ];
      
      for (const selector of avatarSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          avatar = element.attr('src') || '';
          if (avatar) {
            // Convert relative URL to absolute
            if (avatar.startsWith('/')) {
              avatar = 'https://www.hackerrank.com' + avatar;
            }
            break;
          }
        }
      }
      
      let country = '';
      const countrySelectors = [
        '.profile-country',
        '.country',
        '.user-country',
        '.location',
        '.profile-location'
      ];
      
      for (const selector of countrySelectors) {
        const element = $(selector);
        if (element.length > 0 && element.text().trim()) {
          country = element.text().trim();
          break;
        }
      }
      
      // Extract badges with multiple selectors
      const badges = [];
      const badgeSelectors = [
        '.badge-title',
        '.badge-name',
        '.achievement-title',
        '.badge .title',
        '.achievements .badge-title',
        '.profile-badges .badge-title'
      ];
      
      for (const selector of badgeSelectors) {
        $(selector).each((index, element) => {
          const badgeName = $(element).text().trim();
          if (badgeName && !badges.some(b => b.name === badgeName)) {
            badges.push({ name: badgeName });
          }
        });
        if (badges.length > 0) break;
      }
      
      // Extract skills and scores
      const skills = [];
      const skillSelectors = [
        '.skill-name',
        '.domain-name',
        '.track-name',
        '.skill-title',
        '.domain-title'
      ];
      
      for (const selector of skillSelectors) {
        $(selector).each((index, element) => {
          const skillName = $(element).text().trim();
          if (skillName && !skills.includes(skillName)) {
            skills.push(skillName);
          }
        });
        if (skills.length > 0) break;
      }
      
      // Extract ranking information
      let ranking = '';
      const rankingSelectors = [
        '.profile-rank',
        '.rank',
        '.global-rank',
        '.ranking',
        '.profile-ranking'
      ];
      
      for (const selector of rankingSelectors) {
        const element = $(selector);
        if (element.length > 0 && element.text().trim()) {
          ranking = element.text().trim();
          break;
        }
      }
      
      // Extract score information
      let score = 0;
      const scoreSelectors = [
        '.profile-score',
        '.score',
        '.total-score',
        '.points',
        '.hacker-score'
      ];
      
      for (const selector of scoreSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          const scoreText = element.text().trim().replace(/\D/g, '');
          if (scoreText) {
            score = parseInt(scoreText) || 0;
            if (score > 0) break;
          }
        }
      }
      
      // Extract problem solving stats
      let problemsSolved = 0;
      const problemSelectors = [
        '.problems-solved',
        '.solved-count',
        '.challenges-solved',
        '.total-challenges',
        '.problems-count'
      ];
      
      for (const selector of problemSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          const problemText = element.text().trim().replace(/\D/g, '');
          if (problemText) {
            problemsSolved = parseInt(problemText) || 0;
            if (problemsSolved > 0) break;
          }
        }
      }
      
      const result = {
        platform: 'HackerRank',
        username,
        profile: {
          name: name || username,
          avatar: avatar || '',
          country: country || 'N/A'
        },
        stats: {
          score,
          ranking: ranking || 'N/A',
          problemsSolved
        },
        badges: badges,
        badgeCount: badges.length,
        skills: skills,
        profileUrl,
        lastUpdated: new Date().toISOString()
      };

      console.log(`HackerRank stats extracted for ${username}:`, result);

      // Cache the result
      if (userId) {
        await setCachedData(userId, 'hackerrank', result);
      }

      return result;
    } catch (error) {
      console.error(`Error fetching HackerRank stats for ${username}:`, error.message);
      return {
        platform: 'HackerRank',
        username,
        error: error.message,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  // Add basic implementations for other platforms
  hackerearth: async (username, userId = null) => {
    try {
      if (userId) {
        const cachedData = await getCachedData(userId, 'hackerearth');
        if (cachedData) return cachedData;
      }

      const result = {
        profile: { username },
        stats: { connected: true }
      };

      if (userId) {
        await setCachedData(userId, 'hackerearth', result);
      }

      return result;
    } catch (error) {
      console.error('HackerEarth stats fetch failed', error);
      return null;
    }
  },

  kaggle: async (username, userId = null) => {
    try {
      if (userId) {
        const cachedData = await getCachedData(userId, 'kaggle');
        if (cachedData) return cachedData;
      }

      const result = {
        profile: { username },
        stats: { connected: true }
      };

      if (userId) {
        await setCachedData(userId, 'kaggle', result);
      }

      return result;
    } catch (error) {
      console.error('Kaggle stats fetch failed', error);
      return null;
    }
  },

  topcoder: async (username, userId = null) => {
    try {
      if (userId) {
        const cachedData = await getCachedData(userId, 'topcoder');
        if (cachedData) return cachedData;
      }

      const result = {
        profile: { username },
        stats: { connected: true }
      };

      if (userId) {
        await setCachedData(userId, 'topcoder', result);
      }

      return result;
    } catch (error) {
      console.error('TopCoder stats fetch failed', error);
      return null;
    }
  },

  atcoder: async (username, userId = null) => {
    try {
      if (userId) {
        const cachedData = await getCachedData(userId, 'atcoder');
        if (cachedData) return cachedData;
      }

      const result = {
        profile: { username },
        stats: { connected: true }
      };

      if (userId) {
        await setCachedData(userId, 'atcoder', result);
      }

      return result;
    } catch (error) {
      console.error('AtCoder stats fetch failed', error);
      return null;
    }
  },

  spoj: async (username, userId = null) => {
    try {
      if (userId) {
        const cachedData = await getCachedData(userId, 'spoj');
        if (cachedData) return cachedData;
      }

      const result = {
        profile: { username },
        stats: { connected: true }
      };

      if (userId) {
        await setCachedData(userId, 'spoj', result);
      }

      return result;
    } catch (error) {
      console.error('SPOJ stats fetch failed', error);
      return null;
    }
  }
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
        
        // Clear cache for this platform since username changed
        if (user.platformStatsCache && user.platformStatsCache.has(platform)) {
          user.platformStatsCache.delete(platform);
        }
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

// Enhanced Profile Fetching with Caching
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

    // Fetch stats for platforms with usernames using caching
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
            const stats = await statsStrategy(user[platform], user._id);
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
      platformStats,
      cacheInfo: {
        message: "Data is cached and updated based on platform-specific intervals",
        cacheDurations: CACHE_DURATION
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Developer Score Calculation with Enhanced Platform Support
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
        const stats = await platformStatsFetching[platform]?.(user[platform], user._id);
        if (stats) {
          // Custom scoring logic for each platform
          let platformScore = 0;
          switch(platform) {
            case 'leetcode':
              platformScore = (stats.problemStats?.totalSolved || 0) * 10;
              if (stats.contestStats?.rating) {
                platformScore += Math.min(stats.contestStats.rating, 2000);
              }
              platformScore += (stats.badges?.length || 0) * 50;
              break;
              
            case 'github':
              platformScore = (stats.stats?.publicRepos || 0) * 5;
              platformScore += (stats.stats?.totalStars || 0) * 10;
              platformScore += (stats.contributions?.total || 0) * 0.5;
              break;
              
            case 'geeksforgeeks':
              platformScore = (stats.totalSolved || 0) * 5;
              const codingScore = parseInt(stats.codingScores?.coding_score || 0);
              if (!isNaN(codingScore)) {
                platformScore += codingScore;
              }
              break;
              
            case 'codechef':
              platformScore = (stats.ratings?.current || 0) * 0.5;
              platformScore += (stats.problemStats?.totalSolved || 0) * 10;
              break;
              
            case 'codeforces':
              platformScore = (stats.ratings?.current || 0) * 0.8;
              platformScore += (stats.stats?.problemsSolved || 0) * 15;
              break;
              
            case 'hackerrank':
              platformScore = (stats.badgeCount || 0) * 25;
              break;
              
            default:
              platformScore = 50; // Base score for connected platforms
          }
          platformScores[platform] = Math.round(platformScore);
          totalScore += platformScore;
        }
      }
    }

    res.json({
      totalScore: Math.round(totalScore),
      platformScores
    });
  } catch (error) {
    res.status(500).json({
      message: "Score calculation error",
      error: error.message
    });
  }
};

// Update Basic Profile Information
exports.updateBasicProfile = async (req, res) => {
  try {
    const { email, name, bio, location, website, preferences } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic profile fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    
    // Update preferences if provided
    if (preferences) {
      if (preferences.theme) user.preferences.theme = preferences.theme;
      if (preferences.emailNotifications !== undefined) user.preferences.emailNotifications = preferences.emailNotifications;
      if (preferences.publicProfile !== undefined) user.preferences.publicProfile = preferences.publicProfile;
    }

    // Save user
    await user.save();

    res.json({ 
      message: "Basic profile updated successfully", 
      user: { 
        email: user.email,
        name: user.name,
        bio: user.bio,
        location: user.location,
        website: user.website,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Connect Platform Controller with improved validation
exports.connectPlatform = async (req, res) => {
  try {
    const { email, platform, username } = req.body;

    // Validate required fields
    if (!email || !platform || !username) {
      return res.status(400).json({ message: 'Email, platform, and username are required' });
    }

    // Check if platform is supported
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
      return res.status(400).json({ message: 'Platform not supported' });
    }

    // Find user
    let user = await User.findOne({ email });
    
    // Create user if not exists
    if (!user) {
      user = new User({ email, name: req.body.name || 'User' });
    }

    // Validate username before connecting
    const validationStrategy = platformValidationStrategies[platform];
    if (validationStrategy) {
      const isValid = await validationStrategy(username);
      if (!isValid) {
        return res.status(400).json({ 
          message: `Invalid ${platform} username: ${username}`,
          valid: false
        });
      }
    }

    // Connect platform
    user[platform] = username;
    
    // Clear any existing cache for this platform
    if (user.platformStatsCache && user.platformStatsCache.has(platform)) {
      user.platformStatsCache.delete(platform);
    }
    
    await user.save();

    res.json({ 
      message: `${platform} connected successfully`,
      platform,
      username,
      valid: true
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error connecting platform", 
      error: error.message 
    });
  }
};

// Disconnect Platform Controller
exports.disconnectPlatform = async (req, res) => {
  try {
    const { email, platform } = req.body;

    // Validate required fields
    if (!email || !platform) {
      return res.status(400).json({ message: 'Email and platform are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Disconnect platform
    user[platform] = null;
    
    // Clear cached stats for this platform
    if (user.platformStatsCache && user.platformStatsCache.has(platform)) {
      user.platformStatsCache.delete(platform);
    }
    
    await user.save();

    res.json({ 
      message: `${platform} disconnected successfully`,
      platform
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error disconnecting platform", 
      error: error.message 
    });
  }
};

// Force Cache Refresh for a specific platform
exports.refreshPlatformCache = async (req, res) => {
  try {
    const { email, platform } = req.body;

    if (!email || !platform) {
      return res.status(400).json({ message: 'Email and platform are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user[platform]) {
      return res.status(400).json({ message: `${platform} is not connected` });
    }

    // Clear cache for this platform
    if (user.platformStatsCache && user.platformStatsCache.has(platform)) {
      user.platformStatsCache.delete(platform);
      await user.save();
    }

    // Fetch fresh data
    const statsStrategy = platformStatsFetching[platform];
    if (statsStrategy) {
      const stats = await statsStrategy(user[platform], user._id);
      res.json({
        message: `${platform} cache refreshed successfully`,
        platform,
        stats
      });
    } else {
      res.status(400).json({ message: `No stats fetching strategy found for ${platform}` });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error refreshing cache",
      error: error.message
    });
  }
};

// Get Cache Status for all platforms
exports.getCacheStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cacheStatus = {};
    
    SUPPORTED_PLATFORMS.forEach(platform => {
      if (user[platform]) {
        const cacheEntry = user.platformStatsCache?.get(platform);
        cacheStatus[platform] = {
          connected: true,
          username: user[platform],
          cached: !!cacheEntry,
          lastUpdated: cacheEntry?.lastUpdated || null,
          isValid: cacheEntry ? isCacheValid(cacheEntry, platform) : false,
          nextRefresh: cacheEntry ? new Date(new Date(cacheEntry.lastUpdated).getTime() + CACHE_DURATION[platform]) : null
        };
      } else {
        cacheStatus[platform] = {
          connected: false
        };
      }
    });

    res.json({
      cacheStatus,
      cacheDurations: CACHE_DURATION
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting cache status",
      error: error.message
    });
  }
};

// Debug endpoint for testing platform validation and stats
exports.debugPlatform = async (req, res) => {
  try {
    const { platform, username } = req.params;

    if (!SUPPORTED_PLATFORMS.includes(platform)) {
      return res.status(400).json({ message: 'Platform not supported' });
    }

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    console.log(`Debug: Testing ${platform} for username: ${username}`);

    const result = {
      platform,
      username,
      validation: null,
      stats: null,
      errors: []
    };

    // Test validation
    try {
      const validationStrategy = platformValidationStrategies[platform];
      if (validationStrategy) {
        console.log(`Debug: Running validation for ${platform}...`);
        result.validation = await validationStrategy(username);
        console.log(`Debug: Validation result for ${platform}: ${result.validation}`);
      } else {
        result.errors.push(`No validation strategy found for ${platform}`);
      }
    } catch (validationError) {
      console.error(`Debug: Validation error for ${platform}:`, validationError);
      result.errors.push(`Validation error: ${validationError.message}`);
    }

    // Test stats fetching
    try {
      const statsStrategy = platformStatsFetching[platform];
      if (statsStrategy) {
        console.log(`Debug: Running stats fetching for ${platform}...`);
        result.stats = await statsStrategy(username, null); // No userId for debug
        console.log(`Debug: Stats result for ${platform}:`, !!result.stats);
      } else {
        result.errors.push(`No stats fetching strategy found for ${platform}`);
      }
    } catch (statsError) {
      console.error(`Debug: Stats error for ${platform}:`, statsError);
      result.errors.push(`Stats error: ${statsError.message}`);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Debug error",
      error: error.message
    });
  }
};

// Get Public Profile
exports.getPublicProfile = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Find user by email or username
    const user = await User.findOne({ 
      $or: [
        { email: identifier },
        { name: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if profile is public
    if (!user.preferences?.publicProfile) {
      return res.status(403).json({ message: 'Profile is private' });
    }

    // Fetch stats for platforms with usernames (only for public profiles)
    const platformStats = {};
    const statsPromises = SUPPORTED_PLATFORMS
      .filter(platform => user[platform])
      .map(async (platform) => {
        try {
          const statsStrategy = platformStatsFetching[platform];
          if (statsStrategy) {
            const stats = await statsStrategy(user[platform], user._id);
            return { platform, stats };
          }
        } catch (error) {
          console.error(`Error fetching ${platform} stats`, error);
        }
      });

    const resolvedStats = await Promise.allSettled(statsPromises);
    resolvedStats.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        const { platform, stats } = result.value;
        platformStats[platform] = {
          username: user[platform],
          stats
        };
      }
    });

    // Return public profile information
    res.json({
      name: user.name,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      picture: user.picture,
      joinDate: user.createdAt,
      platformStats
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get Profile Analytics
exports.getProfileAnalytics = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate analytics
    const analytics = {
      profileCompleteness: 0,
      platformsConnected: 0,
      totalActivity: 0,
      growthMetrics: {},
      recommendations: []
    };

    // Calculate profile completeness
    const requiredFields = ['name', 'email'];
    const optionalFields = ['bio', 'location', 'website'];
    const platformFields = ['leetcode', 'github', 'geeksforgeeks'];
    
    let completedFields = 0;
    const totalFields = requiredFields.length + optionalFields.length + platformFields.length;
    
    requiredFields.forEach(field => {
      if (user[field]) completedFields++;
    });
    
    optionalFields.forEach(field => {
      if (user[field]) completedFields++;
    });
    
    platformFields.forEach(platform => {
      if (user[platform]) {
        completedFields++;
        analytics.platformsConnected++;
      }
    });
    
    analytics.profileCompleteness = Math.round((completedFields / totalFields) * 100);

    // Fetch platform stats for analytics
    if (analytics.platformsConnected > 0) {
      const platformStats = {};
      const statsPromises = SUPPORTED_PLATFORMS
        .filter(platform => user[platform])
        .map(async (platform) => {
          try {
            const statsStrategy = platformStatsFetching[platform];
            if (statsStrategy) {
              const stats = await statsStrategy(user[platform], user._id);
              return { platform, stats };
            }
          } catch (error) {
            console.error(`Error fetching ${platform} stats for analytics`, error);
          }
        });

      const resolvedStats = await Promise.allSettled(statsPromises);
      resolvedStats.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          const { platform, stats } = result.value;
          platformStats[platform] = stats;
        }
      });

      // Calculate total activity
      Object.entries(platformStats).forEach(([platform, stats]) => {
        switch(platform) {
          case 'leetcode':
            analytics.totalActivity += stats.problemStats?.totalSolved || 0;
            break;
          case 'github':
            analytics.totalActivity += stats.contributions?.total || 0;
            break;
          case 'geeksforgeeks':
            analytics.totalActivity += stats.totalSolved || 0;
            break;
          case 'codechef':
            analytics.totalActivity += stats.problemStats?.totalSolved || 0;
            break;
          case 'codeforces':
            analytics.totalActivity += stats.stats?.problemsSolved || 0;
            break;
        }
      });

      // Generate recommendations
      if (analytics.profileCompleteness < 80) {
        analytics.recommendations.push({
          type: 'profile',
          title: 'Complete your profile',
          description: 'Add more information to make your profile stand out'
        });
      }

      if (analytics.platformsConnected < 3) {
        analytics.recommendations.push({
          type: 'platform',
          title: 'Connect more platforms',
          description: 'Connect additional coding platforms to showcase your skills'
        });
      }

      if (analytics.totalActivity < 100) {
        analytics.recommendations.push({
          type: 'activity',
          title: 'Increase coding activity',
          description: 'Practice more problems and contribute to open source projects'
        });
      }
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({
      message: "Analytics calculation error",
      error: error.message
    });
  }
};
