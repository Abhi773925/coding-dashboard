import { useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../config/api';

// Use the API URL from config for better maintainability
const ANALYTICS_URL = `${config.API_URL}/analytics/track`;
const MAX_RETRY_COUNT = 3;

export const useComponentTracking = (componentName) => {
  const mountTimeRef = useRef(Date.now());
  const retryCountRef = useRef(0);
  
  // Queue for offline analytics - store analytics data to send later
  const storeOfflineAnalytics = (data) => {
    try {
      const offlineAnalytics = JSON.parse(localStorage.getItem('offlineAnalytics') || '[]');
      offlineAnalytics.push({
        ...data,
        timestamp: new Date().toISOString()
      });
      // Limit storage to prevent overflow
      if (offlineAnalytics.length > 100) offlineAnalytics.shift();
      localStorage.setItem('offlineAnalytics', JSON.stringify(offlineAnalytics));
    } catch (err) {
      console.error('Failed to store offline analytics', err);
    }
  };

  const trackView = async (eventType = 'view') => {
    if (process.env.NODE_ENV !== 'production') {
      return; // Don't track in development
    }

    const analyticsData = {
      component: componentName,
      eventType,
      timestamp: new Date().toISOString(),
      duration: eventType === 'leave' ? Date.now() - mountTimeRef.current : undefined,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    const attemptTrack = async (attempt = 0) => {
      try {
        await axios.post(ANALYTICS_URL, analyticsData, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        retryCountRef.current = 0; // Reset retry count on success
        
        // If we have stored offline analytics, try to send them now
        const offlineAnalytics = localStorage.getItem('offlineAnalytics');
        if (offlineAnalytics && offlineAnalytics !== '[]') {
          try {
            await axios.post(`${ANALYTICS_URL}/batch`, JSON.parse(offlineAnalytics), {
              timeout: 5000
            });
            localStorage.removeItem('offlineAnalytics');
          } catch (e) {
            // Silently fail - we'll try again next time
          }
        }
      } catch (error) {
        // Store analytics locally if server is unavailable
        storeOfflineAnalytics(analyticsData);
        
        // Use exponential backoff for retries
        if (attempt < MAX_RETRY_COUNT) {
          const backoffTime = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          return attemptTrack(attempt + 1);
        }
        
        // Log error but don't throw
        console.warn(
          `Analytics tracking failed after ${MAX_RETRY_COUNT} attempts:`,
          error.response?.status || 'Network Error'
        );
      }
    };

    // Make tracking non-blocking
    attemptTrack().catch(() => {});
  };

  useEffect(() => {
    trackView('mount');

    return () => {
      trackView('unmount');
    };
  }, [componentName]);
};
