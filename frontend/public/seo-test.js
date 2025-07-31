// Global SEO Testing Script
// Add this to your browser console or include in index.html for testing

console.log('🔍 SEO Testing Tools Loaded');

// Import SEO testing utilities if not already available
if (typeof window.runSEOTest === 'undefined') {
  // Fallback implementation for manual testing
  window.runSEOTest = function() {
    console.log('🔍 Running Manual SEO Audit...');
    
    const errors = [];
    const warnings = [];
    const suggestions = [];

    // Basic meta tag checks
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');
    const viewport = document.querySelector('meta[name="viewport"]');
    const canonical = document.querySelector('link[rel="canonical"]');

    if (!title || !title.textContent.trim()) {
      errors.push('Missing page title');
    } else if (title.textContent.length < 30 || title.textContent.length > 60) {
      warnings.push(`Title length: ${title.textContent.length} chars (recommended: 30-60)`);
    }

    if (!description || !description.content.trim()) {
      errors.push('Missing meta description');
    } else if (description.content.length < 120 || description.content.length > 160) {
      warnings.push(`Description length: ${description.content.length} chars (recommended: 120-160)`);
    }

    if (!viewport) {
      errors.push('Missing viewport meta tag');
    }

    if (!canonical) {
      warnings.push('Missing canonical URL');
    }

    // Check Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    if (!ogTitle) warnings.push('Missing Open Graph title');
    if (!ogDescription) warnings.push('Missing Open Graph description');
    if (!ogImage) warnings.push('Missing Open Graph image');

    // Check structured data
    const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
    if (jsonLd.length === 0) {
      warnings.push('No structured data found');
    }

    // Check images
    const images = document.querySelectorAll('img');
    let imagesWithoutAlt = 0;
    images.forEach(img => {
      if (!img.alt) imagesWithoutAlt++;
    });
    if (imagesWithoutAlt > 0) {
      warnings.push(`${imagesWithoutAlt} images missing alt text`);
    }

    // Check heading structure
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      errors.push('Missing H1 tag');
    } else if (h1s.length > 1) {
      warnings.push(`Multiple H1 tags (${h1s.length})`);
    }

    // Calculate score
    let score = 100;
    score -= errors.length * 10;
    score -= warnings.length * 5;
    score = Math.max(0, score);

    // Display results
    console.log('\n📊 SEO Audit Results');
    console.log('==================');
    console.log(`Score: ${score}/100`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach((error, i) => console.log(`${i + 1}. ${error}`));
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      warnings.forEach((warning, i) => console.log(`${i + 1}. ${warning}`));
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('\n✅ No critical issues found!');
    }

    return { score, errors, warnings, suggestions };
  };
}

// Quick SEO checks
window.checkSEO = function() {
  console.log('🔍 Quick SEO Check');
  console.log('================');
  
  const title = document.querySelector('title');
  const description = document.querySelector('meta[name="description"]');
  const h1 = document.querySelector('h1');
  const canonical = document.querySelector('link[rel="canonical"]');
  
  console.log('Title:', title ? title.textContent : '❌ Missing');
  console.log('Description:', description ? description.content : '❌ Missing');
  console.log('H1:', h1 ? h1.textContent : '❌ Missing');
  console.log('Canonical:', canonical ? canonical.href : '❌ Missing');
  console.log('URL:', window.location.href);
};

// Performance check
window.checkPerformance = function() {
  if (!window.performance) {
    console.log('❌ Performance API not available');
    return;
  }
  
  console.log('⚡ Performance Metrics');
  console.log('====================');
  
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation) {
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    const ttfb = navigation.responseStart - navigation.requestStart;
    
    console.log(`Page Load Time: ${Math.round(loadTime)}ms`);
    console.log(`DOM Content Loaded: ${Math.round(domContentLoaded)}ms`);
    console.log(`Time to First Byte: ${Math.round(ttfb)}ms`);
    
    if (loadTime > 3000) console.log('⚠️ Slow page load time');
    if (domContentLoaded > 1500) console.log('⚠️ Slow DOM content loaded');
    if (ttfb > 600) console.log('⚠️ Slow server response');
  }
  
  // Core Web Vitals (if available)
  if ('PerformanceObserver' in window) {
    console.log('\n📊 Core Web Vitals will be tracked...');
  }
};

// Check all meta tags
window.checkMetaTags = function() {
  console.log('🏷️ Meta Tags Analysis');
  console.log('====================');
  
  const metaTags = document.querySelectorAll('meta');
  const linkTags = document.querySelectorAll('link');
  
  console.log('\n📋 Meta Tags:');
  metaTags.forEach(meta => {
    const name = meta.name || meta.property || meta.httpEquiv || 'charset';
    const content = meta.content || meta.charset || '(no content)';
    console.log(`${name}: ${content}`);
  });
  
  console.log('\n🔗 Link Tags:');
  linkTags.forEach(link => {
    if (link.rel) {
      console.log(`${link.rel}: ${link.href || link.content || '(no href)'}`);
    }
  });
};

// Export for use
window.seoUtils = {
  runSEOTest: window.runSEOTest,
  checkSEO: window.checkSEO,
  checkPerformance: window.checkPerformance,
  checkMetaTags: window.checkMetaTags
};

console.log('Available commands:');
console.log('- runSEOTest() - Complete SEO audit');
console.log('- checkSEO() - Quick SEO overview');
console.log('- checkPerformance() - Performance metrics');
console.log('- checkMetaTags() - All meta tags');
console.log('- seoUtils - All functions in one object');
