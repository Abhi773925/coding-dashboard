// Google Analytics Integration Script
// Add this script to your index.html before closing </head> tag

// Google Analytics Global Site Tag (gtag.js)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics Measurement ID
gtag('config', 'GA_MEASUREMENT_ID', {
  // Enhanced ecommerce and site search
  custom_map: {
    'custom_parameter_1': 'page_category',
    'custom_parameter_2': 'user_type',
    'custom_parameter_3': 'content_group'
  },
  // Site search tracking
  site_speed_sample_rate: 100,
  // Enhanced link attribution
  use_amp_client_id: true,
  // Debug mode (remove in production)
  debug_mode: false
});

// Track page views automatically
gtag('event', 'page_view', {
  page_title: document.title,
  page_location: window.location.href,
  page_path: window.location.pathname
});

// Custom event tracking functions
window.trackCustomEvent = function(eventName, category, label, value) {
  gtag('event', eventName, {
    event_category: category,
    event_label: label,
    value: value,
    transport_type: 'beacon'
  });
};

// Enhanced ecommerce tracking
window.trackPurchase = function(transactionId, items, value, currency = 'USD') {
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items
  });
};

// Course/content engagement tracking
window.trackCourseEngagement = function(courseId, action, progress = 0) {
  gtag('event', 'course_engagement', {
    event_category: 'Education',
    course_id: courseId,
    engagement_action: action,
    progress_percentage: progress,
    custom_parameter_1: 'courses'
  });
};

// Code compilation tracking
window.trackCodeExecution = function(language, success, executionTime) {
  gtag('event', 'code_execution', {
    event_category: 'Compiler',
    programming_language: language,
    execution_success: success,
    execution_time: executionTime,
    custom_parameter_1: 'compiler'
  });
};

// Contest participation tracking
window.trackContestInteraction = function(contestType, action, contestId) {
  gtag('event', 'contest_interaction', {
    event_category: 'Contests',
    contest_type: contestType,
    interaction_type: action,
    contest_id: contestId,
    custom_parameter_1: 'contests'
  });
};

// Collaboration tracking
window.trackCollaboration = function(action, sessionId, participants) {
  gtag('event', 'collaboration', {
    event_category: 'Collaboration',
    collaboration_action: action,
    session_id: sessionId,
    participant_count: participants,
    custom_parameter_1: 'collaboration'
  });
};

// Learning path tracking
window.trackLearningPath = function(pathId, milestone, completion) {
  gtag('event', 'learning_progress', {
    event_category: 'Learning',
    learning_path: pathId,
    milestone_reached: milestone,
    completion_percentage: completion,
    custom_parameter_1: 'learning'
  });
};

// User registration/login tracking
window.trackUserAuth = function(action, method, success) {
  gtag('event', action, {
    event_category: 'Authentication',
    method: method,
    success: success,
    custom_parameter_2: success ? 'registered' : 'guest'
  });
};

// Search tracking (for internal site search)
window.trackSiteSearch = function(searchTerm, category, results) {
  gtag('event', 'search', {
    search_term: searchTerm,
    search_category: category,
    search_results: results
  });
};

// Video interaction tracking (for tutorial videos)
window.trackVideoInteraction = function(videoId, action, progress) {
  gtag('event', 'video_engagement', {
    event_category: 'Video',
    video_id: videoId,
    video_action: action,
    video_progress: progress
  });
};

// Error tracking
window.trackError = function(errorType, errorMessage, errorPage) {
  gtag('event', 'exception', {
    description: `${errorType}: ${errorMessage}`,
    fatal: false,
    error_page: errorPage
  });
};

// Performance tracking (automatically called by seoAnalytics.js)
window.trackPerformance = function(metric, value, category = 'Performance') {
  gtag('event', metric.toLowerCase(), {
    event_category: category,
    value: Math.round(value),
    non_interaction: true
  });
};

// Scroll depth tracking
let maxScrollDepth = 0;
window.addEventListener('scroll', function() {
  const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  
  if (scrollPercent > maxScrollDepth) {
    maxScrollDepth = scrollPercent;
    
    // Track milestone scroll depths
    if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
      gtag('event', 'scroll', {
        event_category: 'Engagement',
        event_label: `${scrollPercent}%`,
        value: scrollPercent,
        non_interaction: true
      });
    }
  }
}, { passive: true });

// File download tracking
document.addEventListener('click', function(event) {
  const link = event.target.closest('a');
  if (link && link.href) {
    const url = new URL(link.href, window.location);
    const fileExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|tar|gz|mp4|mp3|avi|mov|wmv)$/i;
    
    if (fileExtensions.test(url.pathname)) {
      const fileName = url.pathname.split('/').pop();
      gtag('event', 'file_download', {
        event_category: 'Downloads',
        event_label: fileName,
        transport_type: 'beacon'
      });
    }
  }
});

// Outbound link tracking
document.addEventListener('click', function(event) {
  const link = event.target.closest('a');
  if (link && link.hostname !== window.location.hostname && link.href.startsWith('http')) {
    gtag('event', 'click', {
      event_category: 'Outbound Link',
      event_label: link.href,
      transport_type: 'beacon'
    });
  }
});

// Form submission tracking
document.addEventListener('submit', function(event) {
  const form = event.target;
  if (form.tagName === 'FORM') {
    const formName = form.name || form.id || 'unknown_form';
    gtag('event', 'form_submit', {
      event_category: 'Form',
      event_label: formName,
      transport_type: 'beacon'
    });
  }
});

console.log('📊 Google Analytics tracking initialized with enhanced events');
