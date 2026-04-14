/**
 * FINN ENVIRONMENT CONFIGURATION
 * Frontend configuration management
 */

// API Configuration
export const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  // Staging
  staging: {
    baseURL: 'https://staging-api.betterbag.com/api',
    timeout: 15000,
    retryAttempts: 5,
    retryDelay: 2000
  },
  // Production
  production: {
    baseURL: 'https://api.betterbag.com/api',
    timeout: 20000,
    retryAttempts: 5,
    retryDelay: 3000
  }
};

// Get current environment
export const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Get API config for current environment
export const getAPIConfig = () => {
  return API_CONFIG[ENVIRONMENT] || API_CONFIG.development;
};

// Feature flags
export const FEATURES = {
  enableNotifications: true,
  enableAnalytics: true,
  enableDataExport: true,
  enableRealTimeUpdates: true,
  enableOfflineMode: false,
  enableBetaFeatures: false
};

// UI Configuration
export const UI_CONFIG = {
  theme: {
    primaryBlue: '#3b82f6',
    secondaryPurple: '#8b5cf6',
    successGreen: '#10b981',
    warningOrange: '#f59e0b',
    errorRed: '#ef4444',
    darkBg: '#0a0e27',
    darkBg2: '#1a1f3a',
    darkBg3: '#0f1729',
    textLight: '#e0e6ff',
    textMuted: '#a5b4fc'
  },
  animation: {
    duration: 300,
    timing: 'ease'
  },
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280
  }
};

// Cache Configuration
export const CACHE_CONFIG = {
  dashboardMetrics: 5 * 60 * 1000, // 5 minutes
  expertise: 15 * 60 * 1000, // 15 minutes
  decisions: 2 * 60 * 1000, // 2 minutes
  search: 10 * 60 * 1000, // 10 minutes
  analytics: 30 * 60 * 1000, // 30 minutes
  agents: 5 * 60 * 1000 // 5 minutes
};

// Application Configuration
export const APP_CONFIG = {
  name: 'Finn AI CEO',
  version: '3.0.0',
  appId: 'finn-ai-ceo-v3',
  description: 'Artificial Intelligence Chief Executive Officer for BetterBag',
  logoUrl: '/logo.png',
  supportEmail: 'support@betterbag.com'
};

// Security Configuration
export const SECURITY_CONFIG = {
  // Token
  tokenStorageKey: 'finn_token',
  tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry

  // Session
  sessionTimeout: 60 * 60 * 1000, // 1 hour
  warningTime: 10 * 60 * 1000, // 10 minutes before timeout

  // Password requirements
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,

  // Rate limiting
  maxLoginAttempts: 5,
  lockoutDuration: 30 * 60 * 1000, // 30 minutes

  // CORS
  corsEnabled: true,
  corsCredentials: true,

  // Content Security Policy
  cspEnabled: true,

  // HTTPS enforcement
  enforceHTTPS: ENVIRONMENT === 'production'
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  // Default preferences
  defaultPreferences: {
    emailAlerts: true,
    decisionNotifications: true,
    dailyReport: true,
    weeklyDigest: true,
    pushNotifications: true,
    inAppNotifications: true
  },

  // Notification types
  types: {
    decision: 'Decision Alert',
    metric: 'Metric Alert',
    learning: 'Learning Update',
    system: 'System Message',
    error: 'Error Alert'
  },

  // Priority levels
  priorities: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  }
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  enabled: FEATURES.enableAnalytics && ENVIRONMENT !== 'development',
  trackPageViews: true,
  trackUserInteractions: true,
  trackErrors: true,
  trackPerformance: true,
  sampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0
};

// Logging Configuration
export const LOGGING_CONFIG = {
  level: ENVIRONMENT === 'production' ? 'error' : 'debug',
  enableConsole: ENVIRONMENT !== 'production',
  enableRemote: ENVIRONMENT === 'production',
  remoteEndpoint: 'https://logs.betterbag.com/api/logs',
  maxLogSize: 50 * 1024 * 1024 // 50 MB
};

// Data Configuration
export const DATA_CONFIG = {
  // Date/Time
  dateFormat: 'MMM DD, YYYY',
  timeFormat: '24h',
  timezone: 'auto', // auto-detect or specific timezone

  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,

  // Export
  exportFormats: ['csv', 'json', 'pdf'],
  maxExportSize: 1000 * 1024 * 1024 // 1 GB

  // Retention
  // localStorageRetention: 30 * 24 * 60 * 60 * 1000 // 30 days
};

// Error Configuration
export const ERROR_CONFIG = {
  // Retry strategy
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryDelay: 1000,
  maxRetries: 3,

  // Error messages
  defaultErrorMessage: 'An error occurred. Please try again.',
  networkErrorMessage:
    'Network error. Please check your connection.',
  timeoutErrorMessage: 'Request timeout. Please try again.',
  authErrorMessage: 'Authentication failed. Please log in again.',
  permissionErrorMessage: 'You do not have permission to do this.'
};

// Feature gates
export const isFeatureEnabled = (featureName) => {
  return FEATURES[featureName] === true;
};

// Get config by environment
export const getConfig = (env = ENVIRONMENT) => {
  return {
    api: API_CONFIG[env],
    app: APP_CONFIG,
    ui: UI_CONFIG,
    cache: CACHE_CONFIG,
    security: SECURITY_CONFIG,
    notifications: NOTIFICATION_CONFIG,
    analytics: ANALYTICS_CONFIG,
    logging: LOGGING_CONFIG,
    data: DATA_CONFIG,
    errors: ERROR_CONFIG,
    features: FEATURES
  };
};

export default {
  API_CONFIG,
  ENVIRONMENT,
  FEATURES,
  UI_CONFIG,
  CACHE_CONFIG,
  APP_CONFIG,
  SECURITY_CONFIG,
  NOTIFICATION_CONFIG,
  ANALYTICS_CONFIG,
  LOGGING_CONFIG,
  DATA_CONFIG,
  ERROR_CONFIG,
  getAPIConfig,
  isFeatureEnabled,
  getConfig
};
