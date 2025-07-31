// SEO Hook for Dynamic Meta Tags
import { useEffect } from 'react';

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
  structuredData = null
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | PrepMate`;
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

    // Update canonical URL - make it environment-aware
    if (url) {
      updateCanonicalUrl(url);
    } else {
      // Generate canonical URL based on current environment
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://www.prepmate.site' 
        : window.location.origin;
      const canonicalUrl = `${baseUrl}${window.location.pathname}`;
      updateCanonicalUrl(canonicalUrl);
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

    // Performance and SEO hints
    const addLinkTag = (rel, href, as = null) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (as) link.as = as;
        document.head.appendChild(link);
      }
    };

    // Preconnect to external domains
    addLinkTag('preconnect', 'https://fonts.googleapis.com');
    addLinkTag('preconnect', 'https://fonts.gstatic.com');
    addLinkTag('preconnect', 'https://prepmate-kvol.onrender.com');

  }, [title, description, keywords, image, url, type, author, siteName, twitterCard, structuredData]);
};

export default useSEO;
