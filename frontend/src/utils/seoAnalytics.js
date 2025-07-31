// SEO Analytics and Tracking Utilities
class SEOAnalytics {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.baseUrl = 'https://www.prepmate.site';
    this.initialized = false;
  }

  // Initialize analytics tracking
  init() {
    if (this.initialized || !this.isProduction) return;

    // Initialize Google Analytics
    this.initGA();
    
    // Initialize Search Console
    this.initSearchConsole();
    
    // Track Core Web Vitals
    this.trackCoreWebVitals();
    
    // Track page views
    this.trackPageView();
    
    // Track user interactions
    this.trackUserInteractions();
    
    this.initialized = true;
  }

  // Initialize Google Analytics
  initGA() {
    if (typeof window.gtag !== 'function') return;

    // Enhanced ecommerce tracking
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'page_category',
        custom_parameter_2: 'user_type'
      }
    });
  }

  // Initialize Search Console tracking
  initSearchConsole() {
    // Add search console verification meta tag if not present
    if (!document.querySelector('meta[name="google-site-verification"]')) {
      const meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      meta.content = 'YOUR_SEARCH_CONSOLE_VERIFICATION_CODE';
      document.head.appendChild(meta);
    }
  }

  // Track Core Web Vitals
  trackCoreWebVitals() {
    if (!('PerformanceObserver' in window)) return;

    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          this.sendMetric('LCP', entry.startTime);
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // Track First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'first-input') {
          this.sendMetric('FID', entry.processingStart - entry.startTime);
        }
      }
    }).observe({ type: 'first-input', buffered: true });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.sendMetric('CLS', clsValue);
    }).observe({ type: 'layout-shift', buffered: true });

    // Track Time to First Byte (TTFB)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'navigation') {
          this.sendMetric('TTFB', entry.responseStart - entry.requestStart);
        }
      }
    }).observe({ type: 'navigation', buffered: true });
  }

  // Send performance metrics to GA
  sendMetric(name, value) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        non_interaction: true
      });
    }
  }

  // Track page views with additional SEO data
  trackPageView(customData = {}) {
    if (typeof window.gtag !== 'function') return;

    const pageData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_referrer: document.referrer,
      content_group1: this.getPageCategory(),
      content_group2: this.getUserType(),
      custom_map: {
        'page_load_time': this.getPageLoadTime(),
        'scroll_depth': 0,
        'engagement_time': 0
      },
      ...customData
    };

    window.gtag('config', 'GA_MEASUREMENT_ID', pageData);
    
    // Track scroll depth
    this.trackScrollDepth();
    
    // Track engagement time
    this.trackEngagementTime();
  }

  // Get page category for analytics
  getPageCategory() {
    const path = window.location.pathname;
    if (path === '/') return 'Homepage';
    if (path.startsWith('/courses')) return 'Courses';
    if (path.startsWith('/mentorship')) return 'Mentorship';
    if (path.startsWith('/contests')) return 'Contests';
    if (path.startsWith('/terminal')) return 'Compiler';
    if (path.startsWith('/collaborate')) return 'Collaboration';
    if (path.startsWith('/dashboard') || path.startsWith('/profile')) return 'Dashboard';
    return 'Other';
  }

  // Get user type
  getUserType() {
    // Check if user is logged in
    const hasToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    return hasToken ? 'Registered' : 'Guest';
  }

  // Get page load time
  getPageLoadTime() {
    if (!window.performance || !window.performance.timing) return 0;
    
    const timing = window.performance.timing;
    return timing.loadEventEnd - timing.navigationStart;
  }

  // Track scroll depth
  trackScrollDepth() {
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'scroll', {
              event_category: 'Engagement',
              event_label: `${scrollPercent}%`,
              value: scrollPercent
            });
          }
        }
      }
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          trackScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // Track engagement time
  trackEngagementTime() {
    let startTime = Date.now();
    let isActive = true;
    let totalTime = 0;

    const trackTime = () => {
      if (isActive) {
        totalTime += Date.now() - startTime;
        startTime = Date.now();
      }
    };

    // Track when user becomes inactive
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackTime();
        isActive = false;
      } else {
        startTime = Date.now();
        isActive = true;
      }
    };

    // Track on page unload
    const handleUnload = () => {
      trackTime();
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'engagement_time', {
          event_category: 'Engagement',
          value: Math.round(totalTime / 1000), // Convert to seconds
          non_interaction: true
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleUnload);

    // Track every 30 seconds for active users
    setInterval(() => {
      if (isActive && totalTime > 0) {
        trackTime();
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'engagement_time_checkpoint', {
            event_category: 'Engagement',
            value: Math.round(totalTime / 1000),
            non_interaction: true
          });
        }
      }
    }, 30000);
  }

  // Track user interactions for SEO insights
  trackUserInteractions() {
    // Track clicks on external links
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && link.hostname !== window.location.hostname) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'click', {
            event_category: 'External Link',
            event_label: link.href,
            transport_type: 'beacon'
          });
        }
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (form.tagName === 'FORM') {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'form_submit', {
            event_category: 'Form',
            event_label: form.action || 'Unknown',
            transport_type: 'beacon'
          });
        }
      }
    });

    // Track search queries (if you have internal search)
    this.trackInternalSearch();
  }

  // Track internal search queries
  trackInternalSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"], input[placeholder*="search"]');
    
    searchInputs.forEach(input => {
      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && input.value.trim()) {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'search', {
              search_term: input.value.trim(),
              event_category: 'Internal Search'
            });
          }
        }
      });
    });
  }

  // Track custom events
  trackEvent(eventName, category, label = '', value = 0) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: category,
        event_label: label,
        value: value,
        transport_type: 'beacon'
      });
    }
  }

  // Track conversion events
  trackConversion(conversionType, value = 0, currency = 'USD') {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        event_category: 'Conversion',
        event_label: conversionType,
        value: value,
        currency: currency
      });
    }
  }

  // Generate and submit sitemap
  generateSitemap() {
    const routes = [
      '/',
      '/mentorship',
      '/contests',
      '/allcourse',
      '/terminal',
      '/collaborate',
      '/courses/data-structures',
      '/courses/fullstack',
      '/courses/interview-prep',
      '/learning/javascript',
      '/explore/learning-paths',
      '/explore/challenges',
      '/sql-notes',
      '/interview',
      '/profile',
      '/dashboard',
      '/analytics'
    ];

    const sitemap = routes.map(route => ({
      url: `${this.baseUrl}${route}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: this.getChangeFreq(route),
      priority: this.getPriority(route)
    }));

    return sitemap;
  }

  getChangeFreq(route) {
    if (route === '/' || route === '/contests') return 'daily';
    if (route.startsWith('/courses') || route.startsWith('/mentorship')) return 'weekly';
    return 'monthly';
  }

  getPriority(route) {
    if (route === '/') return 1.0;
    if (['/mentorship', '/allcourse'].includes(route)) return 0.9;
    if (['/contests', '/terminal'].includes(route)) return 0.8;
    if (route.startsWith('/courses')) return 0.8;
    return 0.7;
  }
}

// Create singleton instance
export const seoAnalytics = new SEOAnalytics();

// Auto-initialize on import in production
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    seoAnalytics.init();
  });
}

export default seoAnalytics;
