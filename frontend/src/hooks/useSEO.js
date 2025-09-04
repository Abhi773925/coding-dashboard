// Advanced SEO Hook for Dynamic Meta Tags and Schema Data
import { useEffect } from 'react';

/**
 * Enhanced SEO hook that optimizes pages for search engines with advanced features
 * Implements schema.org structured data, canonical URLs, and comprehensive meta tags
 */
const useSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'PrepMate',
  siteName = 'PrepMate - Coding Interview Preparation',
  twitterCard = 'summary_large_image',
  structuredData = null,
  publishedAt = null,
  modifiedAt = new Date().toISOString(),
  canonicalUrl = null,
  noIndex = false,
  alternateLanguages = [],
  metaRobots = 'index, follow'
}) => {
  useEffect(() => {
    // Update document title with keyword-rich format
    if (title) {
      document.title = `${title} | PrepMate`;
      
      // Also set a short name for browser tabs
      const shortTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
      if (shortTitle) {
        shortTitle.setAttribute('content', 'PrepMate');
      }
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;
      
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update canonical URL
    const updateCanonicalUrl = (href) => {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', href);
      } else {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', href);
        document.head.appendChild(canonical);
      }
    };

    // Basic Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'en');
    updateMetaTag('revisit-after', '7 days');

    // Open Graph Meta Tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card Meta Tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:site', '@PrepMate');
    updateMetaTag('twitter:creator', '@PrepMate');
    
    // Add meta robots tag for indexing control
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : metaRobots);
    
    // Special meta tags for better Google snippet presentation
    updateMetaTag('google', 'notranslate', true);  // Prevent Google from offering translation
    updateMetaTag('googlebot', noIndex ? 'noindex, nofollow' : 'index, follow', true);
    
    // Article specific meta tags
    if (type === 'article' && publishedAt) {
      updateMetaTag('article:published_time', publishedAt, true);
      updateMetaTag('article:modified_time', modifiedAt, true);
      updateMetaTag('og:updated_time', modifiedAt, true);
    }

    // Update canonical URL - use provided canonical or generate one
    const finalCanonicalUrl = canonicalUrl || url || (() => {
      // Generate canonical URL based on current environment
      const baseUrl = (process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('172.20.10.3'))
        ? 'https://www.prepmate.site' 
        : window.location.origin;
      return `${baseUrl}${window.location.pathname}`;
    })();
    
    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.href = finalCanonicalUrl;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = finalCanonicalUrl;
      document.head.appendChild(canonicalLink);
    }
    
    // Add alternate language links for internationalization
    if (alternateLanguages && alternateLanguages.length > 0) {
      alternateLanguages.forEach(alt => {
        let altLink = document.querySelector(`link[hreflang="${alt.lang}"]`);
        if (altLink) {
          altLink.href = alt.url;
        } else {
          altLink = document.createElement('link');
          altLink.rel = 'alternate';
          altLink.hreflang = alt.lang;
          altLink.href = alt.url;
          document.head.appendChild(altLink);
        }
      });
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (scriptTag) {
        scriptTag.textContent = JSON.stringify(structuredData);
      } else {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.textContent = JSON.stringify(structuredData);
        document.head.appendChild(scriptTag);
      }
    }

    // Enhanced Performance and SEO hints
    const addLinkTag = (rel, href, as = null, options = {}) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (as) link.as = as;
        
        // Add any additional attributes
        Object.keys(options).forEach(key => {
          link.setAttribute(key, options[key]);
        });
        
        document.head.appendChild(link);
      }
    };

    // Preconnect to external domains with crossorigin attribute where needed
    addLinkTag('preconnect', 'https://fonts.googleapis.com');
    addLinkTag('preconnect', 'https://fonts.gstatic.com', null, { crossorigin: '' });
    addLinkTag('preconnect', 'https://prepmate-kvol.onrender.com');
    addLinkTag('preconnect', 'https://www.googletagmanager.com');
    
    // Add DNS prefetch for additional performance
    addLinkTag('dns-prefetch', 'https://prepmate-kvol.onrender.com');
    
    // Add metadata for mobile devices
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('format-detection', 'telephone=no');
    
    // Add page load performance markers for analytics
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('seo-loaded');
    }

  }, [
    title, description, keywords, image, url, type, 
    author, siteName, twitterCard, structuredData,
    publishedAt, modifiedAt, canonicalUrl, noIndex,
    alternateLanguages, metaRobots
  ]);
};

export default useSEO;
