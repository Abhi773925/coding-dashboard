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
      const profileUrl = `https://auth.geeksforgeeks.org/user/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
      const $ = cheerio.load(response.data);
      return $('.profile_name').length > 0 || $('.profilePicSection').length > 0;
    } catch {
      return false;
    }
  },

  hackerrank: async (username) => {
    try {
      const profileUrl = `https://www.hackerrank.com/profile/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
      const $ = cheerio.load(response.data);
      return $('.profile-username').length > 0 || $('[data-testid="profile-header"]').length > 0;
    } catch {
      return false;
    }
  },

  codechef: async (username) => {
    try {
      const profileUrl = `https://www.codechef.com/users/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 10000 });
      const $ = cheerio.load(response.data);
      return $('.user-details-container').length > 0 || $('.user-profile').length > 0;
    } catch {
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
      const name = $('h1.vcard-names .p-name, .h-card .p-name').text().trim();
      const login = $('span.p-nickname, .p-nickname').text().trim();
      const bio = $('div.p-note.user-profile-bio, .user-profile-bio').text().trim();
      const company = $('li[itemprop="worksFor"], .p-org').text().trim();
      const location = $('li[itemprop="homeLocation"], .p-label').first().text().trim();
      const blog = $('li[itemprop="url"] a, .p-label a').first().attr('href');
      const avatar = $('img.avatar.avatar-user, .avatar').attr('src');
      const htmlUrl = `https://github.com/${username}`;
      const createdAt = $('li.p-label relative-time, relative-time').attr('datetime');

      // Extract stats with improved selectors
      const followers = parseInt($('a[href$="/followers"] .text-bold, a[href$="/followers"] .Counter').text().replace(/[^\d]/g, '') || '0');
      const following = parseInt($('a[href$="/following"] .text-bold, a[href$="/following"] .Counter').text().replace(/[^\d]/g, '') || '0');
      const publicRepos = parseInt($('nav a[href$="?tab=repositories"] .Counter, .Counter').first().text().replace(/[^\d]/g, '') || '0');

      // Extract contribution stats with improved selectors
      const contributionStats = {
        total: parseInt($('.js-yearly-contributions h2, .ContributionCalendar h2').text().match(/[\d,]+/)?.[0]?.replace(',', '') || '0'),
        streak: 0 // This would require additional scraping
      };

      // Parse contribution calendar with improved selectors
      const contributionCalendar = {};
      $('.ContributionCalendar-day, .js-calendar-graph rect').each((i, el) => {
        const date = $(el).attr('data-date');
        const count = parseInt($(el).attr('data-level') || $(el).attr('data-count') || '0');
        if (date) {
          contributionCalendar[date] = count;
        }
      });

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

      const profileUrl = `https://auth.geeksforgeeks.org/user/${username}`;
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 15000 });
      const $ = cheerio.load(response.data);
      
      // Extract basic profile information
      const name = $('.profile_name').text().trim();
      const institute = $('.profile_institute').text().trim();
      const ranking = $('.rankNum').text().trim();
      const avatar = $('.profile_img img').attr('src');
      
      // Extract coding stats
      const codingScores = {};
      $('.score_card_value').each((index, element) => {
        const label = $(element).prev('.score_card_name').text().trim();
        const value = $(element).text().trim();
        if (label && value) {
          codingScores[label.toLowerCase().replace(/\s+/g, '_')] = value;
        }
      });
      
      // Extract problem-solving stats
      const problemStats = {};
      $('.problemSolved_details_container').each((index, element) => {
        const category = $(element).find('.problemSolved_heading_container h3').text().trim();
        const solvedCount = $(element).find('.solved_problem_container h3').text().trim();
        if (category && solvedCount) {
          problemStats[category.toLowerCase().replace(/\s+/g, '_')] = parseInt(solvedCount) || 0;
        }
      });
      
      // Extract badges/achievements
      const badges = [];
      $('.profile_badge_card').each((index, element) => {
        const badgeName = $(element).find('.badge_card_title').text().trim();
        const badgeDesc = $(element).find('.badge_card_desc').text().trim();
        if (badgeName) {
          badges.push({ name: badgeName, description: badgeDesc });
        }
      });

      const result = {
        profile: {
          name,
          institute,
          ranking,
          avatar
        },
        codingScores,
        problemStats,
        badges,
        totalSolved: Object.values(problemStats).reduce((sum, count) => sum + count, 0)
      };

      // Cache the result
      if (userId) {
        await setCachedData(userId, 'geeksforgeeks', result);
      }

      return result;
    } catch (error) {
      console.error('GeeksforGeeks stats fetch failed', error);
      return null;
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
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 15000 });
      const $ = cheerio.load(response.data);
      
      // Extract basic profile information
      const name = $('.user-details-container .user-name').text().trim();
      const country = $('.user-details-container .user-country-name').text().trim();
      const avatar = $('.user-image img').attr('src');
      
      // Extract ratings and rankings
      const currentRating = $('.rating-number').first().text().trim();
      const highestRating = $('.rating-number').eq(1).text().trim();
      const globalRank = $('.rank-number').first().text().trim();
      const countryRank = $('.rank-number').eq(1).text().trim();
      
      // Extract problem stats
      const problemsFullySolved = $('.problems-solved .prob-comp-solved').text().trim();
      const problemsPartiallySolved = $('.problems-solved .prob-partially-solved').text().trim();
      
      const result = {
        profile: {
          name,
          country,
          avatar
        },
        ratings: {
          current: parseInt(currentRating) || 0,
          highest: parseInt(highestRating) || 0
        },
        rankings: {
          global: parseInt(globalRank) || 0,
          country: parseInt(countryRank) || 0
        },
        problemStats: {
          fullySolved: parseInt(problemsFullySolved) || 0,
          partiallySolved: parseInt(problemsPartiallySolved) || 0,
          totalSolved: (parseInt(problemsFullySolved) || 0) + (parseInt(problemsPartiallySolved) || 0)
        }
      };

      // Cache the result
      if (userId) {
        await setCachedData(userId, 'codechef', result);
      }

      return result;
    } catch (error) {
      console.error('CodeChef stats fetch failed', error);
      return null;
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
      const response = await axios.get(profileUrl, { headers: createHeaders(), timeout: 15000 });
      const $ = cheerio.load(response.data);
      
      // Extract basic profile information
      const name = $('.profile-username').text().trim();
      const avatar = $('.profile-avatar img').attr('src');
      const country = $('.profile-country').text().trim();
      
      // Extract stats
      const badges = [];
      $('.badge-title').each((index, element) => {
        const badgeName = $(element).text().trim();
        if (badgeName) {
          badges.push({ name: badgeName });
        }
      });
      
      const result = {
        profile: {
          username: name,
          avatar,
          country
        },
        badges: badges,
        badgeCount: badges.length
      };

      // Cache the result
      if (userId) {
        await setCachedData(userId, 'hackerrank', result);
      }

      return result;
    } catch (error) {
      console.error('HackerRank stats fetch failed', error);
      return null;
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
