/**
 * FINN SECURITY MIDDLEWARE
 * Request validation, sanitization, and security checks
 */

import { SECURITY_CONFIG } from './config';
import logger from './logger';

class SecurityMiddleware {
  constructor() {
    this.config = SECURITY_CONFIG;
    this.rateLimitMap = new Map();
    this.sessionWarningShown = false;
  }

  /**
   * Validate request parameters
   */
  validateRequest(method, url, body = null) {
    // Check URL validity
    if (!this.isValidURL(url)) {
      throw new Error('Invalid URL');
    }

    // Check method validity
    if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      throw new Error('Invalid HTTP method');
    }

    // Validate body if present
    if (body) {
      this.validateBody(body);
    }

    return true;
  }

  /**
   * Check if URL is valid
   */
  isValidURL(url) {
    try {
      new URL(url, window.location.origin);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate request body
   */
  validateBody(body) {
    if (typeof body === 'string') {
      try {
        JSON.parse(body);
      } catch {
        throw new Error('Invalid JSON body');
      }
    }
    return true;
  }

  /**
   * Sanitize input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }

    // Remove potentially dangerous characters
    return input
      .replace(/[<>\"']/g, char => {
        const map = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return map[char];
      })
      .trim();
  }

  /**
   * Sanitize object recursively
   */
  sanitizeObject(obj) {
    if (typeof obj === 'string') {
      return this.sanitizeInput(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Check HTTPS enforcement
   */
  checkHTTPS() {
    if (
      this.config.enforceHTTPS &&
      window.location.protocol !== 'https:' &&
      !window.location.hostname.includes('localhost')
    ) {
      logger.warn('HTTPS enforcement: Redirecting to HTTPS');
      window.location.protocol = 'https:';
    }
  }

  /**
   * Rate limiting check
   */
  checkRateLimit(endpoint, limit = 10, windowMs = 60000) {
    const now = Date.now();
    const key = endpoint;

    if (!this.rateLimitMap.has(key)) {
      this.rateLimitMap.set(key, []);
    }

    const requests = this.rateLimitMap.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= limit) {
      logger.warn('Rate limit exceeded', { endpoint, limit });
      throw new Error(`Rate limit exceeded for ${endpoint}`);
    }

    validRequests.push(now);
    this.rateLimitMap.set(key, validRequests);
    
    return true;
  }

  /**
   * Validate authentication token
   */
  validateToken(token) {
    if (!token) {
      throw new Error('No authentication token');
    }

    // Token format: Bearer <token>
    if (!token.startsWith('Bearer ')) {
      throw new Error('Invalid token format');
    }

    const actualToken = token.replace('Bearer ', '');
    
    // Basic token validation (should be JWT in production)
    if (actualToken.length < 20) {
      throw new Error('Invalid token');
    }

    return actualToken;
  }

  /**
   * Check session timeout
   */
  checkSessionTimeout() {
    const lastActivity = localStorage.getItem('finn_last_activity');
    if (!lastActivity) {
      localStorage.setItem('finn_last_activity', Date.now().toString());
      return;
    }

    const elapsed = Date.now() - parseInt(lastActivity);
    const warningTime = this.config.warningTime;
    const sessionTimeout = this.config.sessionTimeout;

    if (elapsed > sessionTimeout) {
      logger.warn('Session expired');
      this.handleSessionExpired();
    } else if (elapsed > sessionTimeout - warningTime && !this.sessionWarningShown) {
      logger.info('Session expiring soon');
      this.showSessionWarning();
      this.sessionWarningShown = true;
    }

    localStorage.setItem('finn_last_activity', Date.now().toString());
  }

  /**
   * Show session warning
   */
  showSessionWarning() {
    // Trigger event for UI to show warning
    window.dispatchEvent(new CustomEvent('sessionWarning', {
      detail: { message: 'Your session will expire soon. Please refresh.' }
    }));
  }

  /**
   * Handle session expiration
   */
  handleSessionExpired() {
    localStorage.removeItem('finn_token');
    localStorage.removeItem('finn_user');
    window.dispatchEvent(new CustomEvent('sessionExpired'));
    window.location.href = '/login';
  }

  /**
   * Validate CORS
   */
  validateCORS(origin) {
    if (!this.config.corsEnabled) {
      throw new Error('CORS not enabled');
    }

    // In production, check against whitelist
    const allowedOrigins = [
      window.location.origin,
      'https://api.betterbag.com',
      'https://staging-api.betterbag.com'
    ];

    return allowedOrigins.includes(origin);
  }

  /**
   * Setup CSP headers (for server)
   */
  getCSPHeaders() {
    if (!this.config.cspEnabled) {
      return {};
    }

    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https://api.betterbag.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    };
  }

  /**
   * Validate password strength
   */
  validatePassword(password) {
    const errors = [];

    if (password.length < this.config.passwordMinLength) {
      errors.push(
        `Password must be at least ${this.config.passwordMinLength} characters`
      );
    }

    if (
      this.config.passwordRequireUppercase &&
      !/[A-Z]/.test(password)
    ) {
      errors.push('Password must contain uppercase letters');
    }

    if (
      this.config.passwordRequireNumbers &&
      !/[0-9]/.test(password)
    ) {
      errors.push('Password must contain numbers');
    }

    if (
      this.config.passwordRequireSpecialChars &&
      !/[!@#$%^&*]/.test(password)
    ) {
      errors.push('Password must contain special characters (!@#$%^&*)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Hash password (client-side, for reference only)
   */
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Setup security headers
   */
  setupSecurityHeaders() {
    // Note: These would typically be set on the server
    const headers = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };

    return headers;
  }

  /**
   * Encrypt sensitive data (client-side)
   */
  async encryptData(data, key) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    
    try {
      const encrypted = await crypto.subtle.encrypt(
        'AES-GCM',
        key,
        dataBuffer
      );
      return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    } catch (error) {
      logger.error('Encryption failed', error);
      throw error;
    }
  }

  /**
   * Decrypt sensitive data (client-side)
   */
  async decryptData(encryptedData, key) {
    try {
      const binaryString = atob(encryptedData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const decrypted = await crypto.subtle.decrypt(
        'AES-GCM',
        key,
        bytes
      );

      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decrypted));
    } catch (error) {
      logger.error('Decryption failed', error);
      throw error;
    }
  }
}

// Export singleton
const security = new SecurityMiddleware();

// Initialize security checks
if (typeof window !== 'undefined') {
  security.checkHTTPS();
  
  // Check session periodically
  setInterval(() => {
    security.checkSessionTimeout();
  }, 60000); // Every minute
}

export default security;
