// Environment configuration for payment integration
export const config = {
  // API endpoints
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://prepmate-kvol.onrender.com',
  
  // Payment configuration
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
  PREPMATE_PAYMENT_LINK: 'https://razorpay.me/@prepmate',
  
  // Payment amounts (in paise for Razorpay)
  PRICING: {
    CV_REVIEW: 99900, // ₹999
    BASIC_MENTORSHIP: 59900, // ₹599/month
    PREMIUM_MENTORSHIP: 99900, // ₹999/month
    ENTERPRISE_MENTORSHIP: 199900, // ₹1999/month
    ONE_TIME_SESSION: 149900, // ₹1499/hour (base rate)
  },
  
  // Feature flags
  FEATURES: {
    PAYMENT_INTEGRATION: true,
    CV_REVIEW_SERVICE: true,
    MENTORSHIP_PLATFORM: true,
    SUPPORT_TICKETS: true,
  },
  
  // Payment methods
  PAYMENT_METHODS: {
    RAZORPAY_CHECKOUT: true,
    PREPMATE_DIRECT: true,
    UPI_QR: true,
  },
  
  // App metadata
  APP_NAME: 'PrepMate',
  APP_DESCRIPTION: 'Complete Coding Interview Preparation Platform',
  CONTACT_EMAIL: 'support@prepmate.site',
  
  // Development settings
  DEBUG: import.meta.env.MODE === 'development',
  
  // Webhook URLs (for production)
  WEBHOOK_ENDPOINTS: {
    PAYMENT_SUCCESS: '/api/webhooks/payment-success',
    PAYMENT_FAILED: '/api/webhooks/payment-failed',
    SUBSCRIPTION_CREATED: '/api/webhooks/subscription-created'
  }
};

export default config;
