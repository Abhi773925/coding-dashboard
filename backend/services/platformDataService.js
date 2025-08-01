const User = require('../models/User');

class PlatformDataService {
  constructor() {
    this.CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  }

  /**
   * Get platform data with caching
   * @param {string} email - User email
   * @param {string} platform - Platform name
   * @param {Function} fetchFunction - Function to fetch fresh data
   * @returns {Promise<Object|null>} Platform data or null
   */
  async getPlatformData(email, platform, fetchFunction) {
    try {
      const user = await User.findOne({ email });
      if (!user || !user[platform]) {
        return null;
      }

      // Check if we have cached data
      const cachedData = user.platformStatsCache?.get(platform);
      const now = new Date();

      if (cachedData && cachedData.lastUpdated) {
        const cacheAge = now - new Date(cachedData.lastUpdated);
        if (cacheAge < this.CACHE_DURATION) {
          console.log(`Using cached data for ${platform}`);
          return cachedData.data;
        }
      }

      // Fetch fresh data
      console.log(`Fetching fresh data for ${platform}`);
      const freshData = await fetchFunction(user[platform]);
      
      if (freshData) {
        // Update cache
        if (!user.platformStatsCache) {
          user.platformStatsCache = new Map();
        }
        
        user.platformStatsCache.set(platform, {
          data: freshData,
          lastUpdated: now
        });
        
        await user.save();
      }

      return freshData;
    } catch (error) {
      console.error(`Error getting platform data for ${platform}:`, error);
      return null;
    }
  }

  /**
   * Clear cache for a specific platform
   * @param {string} email - User email
   * @param {string} platform - Platform name
   */
  async clearPlatformCache(email, platform) {
    try {
      const user = await User.findOne({ email });
      if (user && user.platformStatsCache) {
        user.platformStatsCache.delete(platform);
        await user.save();
      }
    } catch (error) {
      console.error(`Error clearing cache for ${platform}:`, error);
    }
  }

  /**
   * Clear all cached data for a user
   * @param {string} email - User email
   */
  async clearAllCache(email) {
    try {
      const user = await User.findOne({ email });
      if (user) {
        user.platformStatsCache = new Map();
        await user.save();
      }
    } catch (error) {
      console.error(`Error clearing all cache:`, error);
    }
  }

  /**
   * Get cache info for a user
   * @param {string} email - User email
   * @returns {Promise<Object>} Cache information
   */
  async getCacheInfo(email) {
    try {
      const user = await User.findOne({ email });
      if (!user || !user.platformStatsCache) {
        return { platforms: {}, totalCached: 0 };
      }

      const cacheInfo = { platforms: {}, totalCached: 0 };
      const now = new Date();

      for (const [platform, data] of user.platformStatsCache.entries()) {
        const ageMs = now - new Date(data.lastUpdated);
        const ageHours = Math.round(ageMs / (1000 * 60 * 60));
        const isExpired = ageMs > this.CACHE_DURATION;

        cacheInfo.platforms[platform] = {
          lastUpdated: data.lastUpdated,
          ageHours,
          isExpired,
          hasData: !!data.data
        };

        if (!isExpired) {
          cacheInfo.totalCached++;
        }
      }

      return cacheInfo;
    } catch (error) {
      console.error(`Error getting cache info:`, error);
      return { platforms: {}, totalCached: 0 };
    }
  }

  /**
   * Preload data for all connected platforms
   * @param {string} email - User email
   * @param {Object} fetchStrategies - Object containing fetch functions for each platform
   */
  async preloadAllPlatformData(email, fetchStrategies) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const platforms = Object.keys(fetchStrategies).filter(platform => user[platform]);
      const results = {};

      // Fetch data for all platforms in parallel
      const fetchPromises = platforms.map(async (platform) => {
        try {
          const data = await this.getPlatformData(email, platform, fetchStrategies[platform]);
          results[platform] = {
            username: user[platform],
            stats: data,
            success: !!data
          };
        } catch (error) {
          console.error(`Failed to preload ${platform} data:`, error);
          results[platform] = {
            username: user[platform],
            stats: null,
            success: false,
            error: error.message
          };
        }
      });

      await Promise.allSettled(fetchPromises);
      return results;
    } catch (error) {
      console.error('Error preloading platform data:', error);
      throw error;
    }
  }

  /**
   * Schedule cache refresh for a user
   * @param {string} email - User email
   * @param {Object} fetchStrategies - Object containing fetch functions for each platform
   */
  async scheduleRefresh(email, fetchStrategies) {
    // This could be enhanced with a job queue system like Bull or Agenda
    setTimeout(async () => {
      try {
        console.log(`Refreshing cache for ${email}`);
        await this.preloadAllPlatformData(email, fetchStrategies);
      } catch (error) {
        console.error(`Scheduled refresh failed for ${email}:`, error);
      }
    }, 5000); // Refresh after 5 seconds (non-blocking)
  }
}

module.exports = new PlatformDataService();
