// Performance Optimization Component
import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadResource = (href, as, type = null) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    };

    // Preload critical fonts
    preloadResource('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', 'style');

    // Only preload images that are critical and above-the-fold
    // Remove preloading for images that may not be immediately visible
    // preloadResource('/images/prepmate-logo.svg', 'image'); // Uncomment if logo is critical
    // preloadResource('/images/hero-background.svg', 'image'); // Uncomment if hero background is critical

    // DNS prefetch for external domains
    const dnsPrefetch = (href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = href;
        document.head.appendChild(link);
      }
    };

    dnsPrefetch('//fonts.googleapis.com');
    dnsPrefetch('//fonts.gstatic.com');
    dnsPrefetch('//prepmate-kvol.onrender.com');
    dnsPrefetch('//www.google-analytics.com');

    // Preconnect to critical third-party origins
    const preconnect = (href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = '';
        document.head.appendChild(link);
      }
    };

    preconnect('https://fonts.gstatic.com');
    preconnect('https://prepmate-kvol.onrender.com');

    // Lazy load non-critical resources
    const lazyLoadImage = (img) => {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazy');
            imageObserver.unobserve(lazyImage);
          }
        });
      });

      imageObserver.observe(img);
    };

    // Apply lazy loading to images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(lazyLoadImage);

    // Service Worker registration for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Critical CSS inlining detection
    const criticalCSS = document.querySelector('style[data-critical]');
    if (!criticalCSS) {
      // If critical CSS is not inlined, load it with high priority
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/critical.css';
      link.media = 'all';
      document.head.appendChild(link);
    }

    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          
          // Send performance data to analytics
          if (window.gtag) {
            window.gtag('event', 'page_load_time', {
              event_category: 'Performance',
              event_label: window.location.pathname,
              value: Math.round(loadTime)
            });
          }
        }, 0);
      });
    }

    // Resource hints for next likely navigation
    const addResourceHint = (rel, href, as = null) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (as) link.as = as;
      document.head.appendChild(link);
    };

    // Prefetch likely next pages
    const prefetchPages = [
      '/mentorship',
      '/contests',
      '/courses',
      '/dashboard'
    ];

    // Prefetch on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        prefetchPages.forEach(page => {
          addResourceHint('prefetch', page);
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        prefetchPages.forEach(page => {
          addResourceHint('prefetch', page);
        });
      }, 2000);
    }

  }, []);

  return null;
};

export default PerformanceOptimizer;
