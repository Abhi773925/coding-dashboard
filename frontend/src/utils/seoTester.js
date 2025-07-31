// SEO Testing and Validation Utilities
export class SEOTester {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }

  // Run comprehensive SEO audit
  runAudit() {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];

    console.log('🔍 Running SEO Audit...');
    
    this.testMetaTags();
    this.testHeadings();
    this.testImages();
    this.testLinks();
    this.testStructuredData();
    this.testPerformance();
    this.testAccessibility();
    this.testMobileOptimization();
    this.testSocialMedia();
    this.testCanonical();

    this.generateReport();
  }

  // Test meta tags
  testMetaTags() {
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');
    const keywords = document.querySelector('meta[name="keywords"]');
    const viewport = document.querySelector('meta[name="viewport"]');
    const charset = document.querySelector('meta[charset]');

    // Title tests
    if (!title || !title.textContent.trim()) {
      this.errors.push('Missing page title');
    } else {
      const titleLength = title.textContent.length;
      if (titleLength < 30) {
        this.warnings.push(`Title too short (${titleLength} chars). Recommended: 30-60 chars`);
      } else if (titleLength > 60) {
        this.warnings.push(`Title too long (${titleLength} chars). Recommended: 30-60 chars`);
      }
    }

    // Description tests
    if (!description || !description.content.trim()) {
      this.errors.push('Missing meta description');
    } else {
      const descLength = description.content.length;
      if (descLength < 120) {
        this.warnings.push(`Description too short (${descLength} chars). Recommended: 120-160 chars`);
      } else if (descLength > 160) {
        this.warnings.push(`Description too long (${descLength} chars). Recommended: 120-160 chars`);
      }
    }

    // Other meta tags
    if (!viewport) {
      this.errors.push('Missing viewport meta tag');
    }

    if (!charset) {
      this.errors.push('Missing charset meta tag');
    }

    if (!keywords) {
      this.suggestions.push('Consider adding meta keywords for better categorization');
    }
  }

  // Test heading structure
  testHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const h1s = document.querySelectorAll('h1');

    if (h1s.length === 0) {
      this.errors.push('Missing H1 tag');
    } else if (h1s.length > 1) {
      this.warnings.push(`Multiple H1 tags found (${h1s.length}). Use only one H1 per page`);
    }

    if (headings.length === 0) {
      this.warnings.push('No heading tags found');
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        this.warnings.push('First heading should be H1');
      }
      
      if (level > previousLevel + 1) {
        this.warnings.push(`Heading hierarchy skip detected: H${previousLevel} to H${level}`);
      }
      
      if (!heading.textContent.trim()) {
        this.errors.push(`Empty ${heading.tagName} tag found`);
      }
      
      previousLevel = level;
    });
  }

  // Test images
  testImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      if (!img.alt) {
        this.errors.push(`Image ${index + 1}: Missing alt attribute`);
      } else if (img.alt.trim() === '') {
        this.warnings.push(`Image ${index + 1}: Empty alt attribute`);
      }

      if (!img.src) {
        this.errors.push(`Image ${index + 1}: Missing src attribute`);
      }

      // Check for lazy loading
      if (!img.loading) {
        this.suggestions.push(`Image ${index + 1}: Consider adding loading="lazy" for better performance`);
      }

      // Check image size attributes
      if (!img.width || !img.height) {
        this.suggestions.push(`Image ${index + 1}: Consider adding width and height attributes to prevent layout shift`);
      }
    });

    if (images.length === 0) {
      this.suggestions.push('No images found. Consider adding relevant images to improve engagement');
    }
  }

  // Test links
  testLinks() {
    const links = document.querySelectorAll('a');
    const externalLinks = [];
    
    links.forEach((link, index) => {
      if (!link.href) {
        this.warnings.push(`Link ${index + 1}: Missing href attribute`);
      }

      if (!link.textContent.trim() && !link.querySelector('img[alt]')) {
        this.errors.push(`Link ${index + 1}: Missing descriptive text or alt text`);
      }

      // Check external links
      if (link.hostname && link.hostname !== window.location.hostname) {
        externalLinks.push(link);
        
        if (!link.rel || !link.rel.includes('noopener')) {
          this.warnings.push(`External link ${index + 1}: Missing rel="noopener" for security`);
        }
      }

      // Check for generic link text
      const genericTexts = ['click here', 'read more', 'learn more', 'here', 'more'];
      if (genericTexts.includes(link.textContent.toLowerCase().trim())) {
        this.suggestions.push(`Link ${index + 1}: Use more descriptive link text instead of "${link.textContent}"`);
      }
    });

    if (externalLinks.length > 10) {
      this.suggestions.push(`High number of external links (${externalLinks.length}). Consider reducing for better link equity`);
    }
  }

  // Test structured data
  testStructuredData() {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (jsonLdScripts.length === 0) {
      this.warnings.push('No structured data (JSON-LD) found');
      return;
    }

    jsonLdScripts.forEach((script, index) => {
      try {
        const data = JSON.parse(script.textContent);
        
        if (!data['@context'] || !data['@type']) {
          this.warnings.push(`Structured data ${index + 1}: Missing @context or @type`);
        }

        // Validate common structured data types
        if (data['@type'] === 'WebSite') {
          if (!data.url || !data.name) {
            this.warnings.push(`WebSite structured data: Missing required properties`);
          }
        }

        if (data['@type'] === 'Organization') {
          if (!data.name || !data.url) {
            this.warnings.push(`Organization structured data: Missing required properties`);
          }
        }

      } catch (error) {
        this.errors.push(`Structured data ${index + 1}: Invalid JSON format`);
      }
    });
  }

  // Test performance metrics
  testPerformance() {
    if (!window.performance) {
      this.warnings.push('Performance API not available');
      return;
    }

    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

      if (loadTime > 3000) {
        this.warnings.push(`Slow page load time: ${Math.round(loadTime)}ms. Target: <3000ms`);
      }

      if (domContentLoaded > 1500) {
        this.warnings.push(`Slow DOM content loaded: ${Math.round(domContentLoaded)}ms. Target: <1500ms`);
      }
    }

    // Check for render-blocking resources
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');

    if (stylesheets.length > 5) {
      this.suggestions.push(`Multiple stylesheets (${stylesheets.length}). Consider combining for better performance`);
    }

    if (scripts.length > 3) {
      this.suggestions.push(`Multiple synchronous scripts (${scripts.length}). Consider async/defer attributes`);
    }
  }

  // Test accessibility
  testAccessibility() {
    // Check for proper document structure
    const main = document.querySelector('main');
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (!main) {
      this.warnings.push('Missing <main> landmark for accessibility');
    }

    if (!nav) {
      this.suggestions.push('Consider adding <nav> landmark for better accessibility');
    }

    // Check for skip link
    const skipLink = document.querySelector('a[href^="#"]:first-child');
    if (!skipLink || !skipLink.textContent.toLowerCase().includes('skip')) {
      this.suggestions.push('Consider adding a skip navigation link for accessibility');
    }

    // Check for proper form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');

      if (!label && !ariaLabel && !ariaLabelledby) {
        this.warnings.push(`Form control ${index + 1}: Missing associated label`);
      }
    });

    // Check color contrast (basic check)
    const elements = document.querySelectorAll('p, span, div, a, button, h1, h2, h3, h4, h5, h6');
    elements.forEach((element, index) => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // This is a simplified check - in practice, you'd want a more sophisticated color contrast analyzer
      if (color === backgroundColor) {
        this.warnings.push(`Element ${index + 1}: Text color same as background color`);
      }
    });
  }

  // Test mobile optimization
  testMobileOptimization() {
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (!viewport) {
      this.errors.push('Missing viewport meta tag for mobile optimization');
    } else {
      const content = viewport.content;
      if (!content.includes('width=device-width')) {
        this.warnings.push('Viewport should include width=device-width');
      }
      if (!content.includes('initial-scale=1')) {
        this.warnings.push('Viewport should include initial-scale=1');
      }
    }

    // Check for mobile-friendly font sizes
    const textElements = document.querySelectorAll('p, span, div, a, button, li');
    textElements.forEach((element, index) => {
      const style = window.getComputedStyle(element);
      const fontSize = parseInt(style.fontSize);
      
      if (fontSize < 12) {
        this.warnings.push(`Small font size detected (${fontSize}px). Minimum recommended: 16px for mobile`);
      }
    });

    // Check for touch-friendly button sizes
    const buttons = document.querySelectorAll('button, a, input[type="submit"], input[type="button"]');
    buttons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      const minSize = 44; // iOS recommendation
      
      if (rect.width < minSize || rect.height < minSize) {
        this.suggestions.push(`Button ${index + 1}: Too small for touch (${Math.round(rect.width)}x${Math.round(rect.height)}px). Recommended: 44x44px minimum`);
      }
    });
  }

  // Test social media optimization
  testSocialMedia() {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogType = document.querySelector('meta[property="og:type"]');

    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');

    // Open Graph tests
    if (!ogTitle) this.warnings.push('Missing Open Graph title');
    if (!ogDescription) this.warnings.push('Missing Open Graph description');
    if (!ogImage) this.warnings.push('Missing Open Graph image');
    if (!ogUrl) this.warnings.push('Missing Open Graph URL');
    if (!ogType) this.suggestions.push('Consider adding Open Graph type');

    // Twitter Card tests
    if (!twitterCard) this.warnings.push('Missing Twitter Card type');
    if (!twitterTitle) this.suggestions.push('Missing Twitter title');
    if (!twitterDescription) this.suggestions.push('Missing Twitter description');
    if (!twitterImage) this.suggestions.push('Missing Twitter image');

    // Image size validation (if images exist)
    if (ogImage && ogImage.content) {
      this.suggestions.push('Verify Open Graph image is 1200x630px for optimal display');
    }

    if (twitterImage && twitterImage.content) {
      this.suggestions.push('Verify Twitter image meets card requirements (summary: 120x120px, large: 280x150px)');
    }
  }

  // Test canonical URL
  testCanonical() {
    const canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
      this.warnings.push('Missing canonical URL');
    } else {
      const href = canonical.href;
      const currentUrl = window.location.href.split('?')[0].split('#')[0]; // Remove query params and fragments
      
      if (href !== currentUrl) {
        this.suggestions.push('Canonical URL differs from current page URL - verify this is intentional');
      }
    }
  }

  // Generate comprehensive report
  generateReport() {
    const score = this.calculateScore();
    
    console.log('\n📊 SEO Audit Report');
    console.log('==================');
    console.log(`Overall Score: ${score}/100`);
    console.log(`Status: ${this.getScoreStatus(score)}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors (Must Fix):');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ Warnings (Should Fix):');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    if (this.suggestions.length > 0) {
      console.log('\n💡 Suggestions (Nice to Have):');
      this.suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion}`);
      });
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ Excellent! No critical SEO issues found.');
    }

    console.log('\n📋 Summary:');
    console.log(`- Errors: ${this.errors.length}`);
    console.log(`- Warnings: ${this.warnings.length}`);
    console.log(`- Suggestions: ${this.suggestions.length}`);

    return {
      score,
      status: this.getScoreStatus(score),
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions
    };
  }

  // Calculate SEO score
  calculateScore() {
    let score = 100;
    
    // Deduct points for errors (critical issues)
    score -= this.errors.length * 10;
    
    // Deduct points for warnings (important issues)
    score -= this.warnings.length * 5;
    
    // Deduct points for suggestions (minor issues)
    score -= this.suggestions.length * 1;
    
    return Math.max(0, score);
  }

  // Get score status
  getScoreStatus(score) {
    if (score >= 90) return '🟢 Excellent';
    if (score >= 80) return '🟡 Good';
    if (score >= 70) return '🟠 Fair';
    if (score >= 60) return '🔴 Poor';
    return '⛔ Critical';
  }

  // Export report as JSON
  exportReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      score: this.calculateScore(),
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `seo-audit-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
}

// Helper function to run SEO test
export const runSEOTest = () => {
  const tester = new SEOTester();
  return tester.runAudit();
};

// Helper function to test specific aspects
export const testSEOAspect = (aspect) => {
  const tester = new SEOTester();
  
  switch (aspect.toLowerCase()) {
    case 'meta':
      tester.testMetaTags();
      break;
    case 'headings':
      tester.testHeadings();
      break;
    case 'images':
      tester.testImages();
      break;
    case 'links':
      tester.testLinks();
      break;
    case 'performance':
      tester.testPerformance();
      break;
    case 'accessibility':
      tester.testAccessibility();
      break;
    case 'mobile':
      tester.testMobileOptimization();
      break;
    case 'social':
      tester.testSocialMedia();
      break;
    default:
      console.log('Unknown aspect. Available: meta, headings, images, links, performance, accessibility, mobile, social');
      return;
  }
  
  tester.generateReport();
};

export default SEOTester;
