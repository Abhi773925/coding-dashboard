import { useEffect, useRef } from 'react';
import axios from 'axios';

const ANALYTICS_URL = 'http://localhost:5000/api/analytics/track';
const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

export const useComponentTracking = (componentName) => {
  const mountTimeRef = useRef(Date.now());
  const retryCountRef = useRef(0);

  const trackView = async (eventType = 'view') => {
    if (process.env.NODE_ENV !== 'production') {
      return; // Don't track in development
    }

    const attemptTrack = async () => {
      try {
        await axios.post(ANALYTICS_URL, {
          component: componentName,
          eventType,
          timestamp: new Date().toISOString(),
          duration: eventType === 'leave' ? Date.now() - mountTimeRef.current : undefined,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        retryCountRef.current = 0; // Reset retry count on success
      } catch (error) {
        if (retryCountRef.current < RETRY_COUNT) {
          retryCountRef.current++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCountRef.current));
          return attemptTrack();
        }
        // Log error but don't throw
        console.warn(
          `Analytics tracking failed for ${componentName} after ${RETRY_COUNT} attempts:`,
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
