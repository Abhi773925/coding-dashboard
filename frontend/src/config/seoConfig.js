// SEO Configuration and Constants
export const SEO_CONFIG = {
  siteName: 'PrepMate',
  siteUrl: 'https://www.prepmate.site',
  defaultTitle: 'PrepMate - Master Coding Interviews with Expert Mentorship',
  defaultDescription: 'Excel in coding interviews with PrepMate\'s comprehensive platform. Get expert mentorship, practice coding challenges, and access real-time collaboration tools. Join thousands of successful developers.',
  defaultImage: 'https://www.prepmate.site/images/prepmate-og-image.jpg',
  defaultKeywords: 'coding interviews, programming practice, coding mentorship, leetcode practice, software engineer preparation, coding challenges, interview preparation, programming tutorial, data structures, algorithms',
  author: 'PrepMate Team',
  twitterHandle: '@PrepMate',
  language: 'en',
  themeColor: '#2563eb',
  backgroundColor: '#ffffff'
};

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: 'PrepMate - Master Coding Interviews with Expert Mentorship',
    description: 'Excel in coding interviews with PrepMate\'s comprehensive platform. Get expert mentorship, practice coding challenges, and access real-time collaboration tools.',
    keywords: 'coding interviews, programming practice, coding mentorship, leetcode practice, software engineer preparation',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "PrepMate",
      "url": "https://www.prepmate.site",
      "description": "Comprehensive coding interview preparation platform with expert mentorship",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.prepmate.site/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },
  
  mentorship: {
    title: 'Expert Coding Mentorship - One-on-One Guidance',
    description: 'Connect with experienced software engineers for personalized coding interview preparation. Get expert guidance, code reviews, and career advice.',
    keywords: 'coding mentorship, software engineer mentor, programming guidance, code review, career advice, one-on-one mentoring',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Coding Mentorship",
      "description": "Expert one-on-one coding mentorship for interview preparation",
      "provider": {
        "@type": "Organization",
        "name": "PrepMate"
      },
      "serviceType": "Educational Services",
      "areaServed": "Worldwide"
    }
  },

  contests: {
    title: 'Coding Contests & Competitions - Stay Updated',
    description: 'Track coding contests from LeetCode, CodeChef, Codeforces, and more. Never miss a programming competition with our comprehensive contest calendar.',
    keywords: 'coding contests, programming competitions, leetcode contests, codechef contests, codeforces, competitive programming',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Coding Contests",
      "description": "Programming competitions and coding contests tracker",
      "organizer": {
        "@type": "Organization",
        "name": "PrepMate"
      }
    }
  },

  compiler: {
    title: 'Online Code Compiler - Multi-Language Support',
    description: 'Compile and run code online in 40+ programming languages. Features real-time collaboration, syntax highlighting, and instant execution.',
    keywords: 'online compiler, code editor, programming languages, javascript compiler, python compiler, java compiler, c++ compiler',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PrepMate Code Compiler",
      "description": "Online multi-language code compiler and editor",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web Browser"
    }
  },

  courses: {
    title: 'Coding Interview Courses - Structured Learning',
    description: 'Master data structures, algorithms, and system design with our comprehensive courses. From beginner to advanced, prepare for FAANG interviews.',
    keywords: 'coding courses, data structures course, algorithms course, system design, FAANG interview preparation, programming tutorial',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Coding Interview Preparation",
      "description": "Comprehensive courses for coding interview preparation",
      "provider": {
        "@type": "Organization",
        "name": "PrepMate"
      },
      "educationalLevel": "All Levels"
    }
  },

  dashboard: {
    title: 'Learning Dashboard - Track Your Progress',
    description: 'Monitor your coding interview preparation progress. View analytics, track streaks, and get personalized recommendations.',
    keywords: 'learning dashboard, progress tracking, coding analytics, study plan, interview preparation tracker',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PrepMate Dashboard",
      "description": "Personal learning dashboard for coding interview preparation"
    }
  },

  collaboration: {
    title: 'Real-time Code Collaboration - Pair Programming',
    description: 'Collaborate on code in real-time with video chat, shared terminals, and live editing. Perfect for mock interviews and pair programming.',
    keywords: 'code collaboration, pair programming, real-time coding, mock interviews, video chat coding, shared code editor',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Code Collaboration Tool",
      "description": "Real-time code collaboration platform with video chat"
    }
  },

  pricing: {
    title: 'Pricing Plans - Affordable Mentorship & Courses',
    description: 'Choose from flexible pricing plans for coding interview preparation. Get access to expert mentorship, courses, and premium features.',
    keywords: 'coding mentorship pricing, interview preparation cost, programming courses price, affordable coding education',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "PriceSpecification",
      "name": "PrepMate Pricing",
      "description": "Flexible pricing plans for coding interview preparation"
    }
  }
};

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  };
};

// Generate FAQ structured data
export const generateFAQStructuredData = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Generate organization structured data
export const ORGANIZATION_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PrepMate",
  "url": "https://www.prepmate.site",
  "logo": "https://www.prepmate.site/images/prepmate-logo.png",
  "description": "Comprehensive coding interview preparation platform with expert mentorship",
  "sameAs": [
    "https://twitter.com/PrepMate",
    "https://linkedin.com/company/prepmate",
    "https://github.com/prepmate"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-XXX-XXX-XXXX",
    "contactType": "customer service",
    "email": "support@prepmate.site"
  }
};

export default SEO_CONFIG;
