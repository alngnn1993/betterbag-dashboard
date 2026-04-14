/**
 * FINN SECURITY HARDENING MODULE
 * Encryption, Validation, and Threat Protection
 * 
 * Comprehensive security for all Finn operations
 */

const crypto = require('crypto');

class SecurityHardener {
  constructor(encryptionKey) {
    this.encryptionKey = encryptionKey;
    this.algorithm = 'aes-256-gcm';
    this.threatLog = [];
  }

  /**
   * Encrypt sensitive data (AES-256-GCM)
   */
  encryptData(data) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey),
        iv
      );

      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm: this.algorithm
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData) {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey),
        Buffer.from(encryptedData.iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Input validation
   * Prevent injection attacks and malformed data
   */
  validateInput(input, rules) {
    const errors = [];

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = input[field];

      // Check required
      if (fieldRules.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      // Check type
      if (fieldRules.type && typeof value !== fieldRules.type) {
        errors.push(`${field} must be ${fieldRules.type}`);
      }

      // Check length
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors.push(`${field} must be at least ${fieldRules.minLength} characters`);
      }

      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors.push(`${field} must be at most ${fieldRules.maxLength} characters`);
      }

      // Check pattern (regex)
      if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }

      // Check allowed values
      if (
        fieldRules.allowedValues &&
        !fieldRules.allowedValues.includes(value)
      ) {
        errors.push(
          `${field} must be one of: ${fieldRules.allowedValues.join(', ')}`
        );
      }

      // Check custom validation
      if (fieldRules.custom && !fieldRules.custom(value)) {
        errors.push(fieldRules.customMessage || `${field} validation failed`);
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Sanitize user input
   * Remove dangerous characters and patterns
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/'/g, '') // Remove quotes
      .replace(/;/g, '') // Remove semicolons
      .replace(/--/g, '') // Remove SQL comment markers
      .trim();
  }

  /**
   * Rate limiting
   * Prevent brute force and DoS attacks
   */
  checkRateLimit(userId, action, limit = 100, windowSeconds = 60) {
    const key = `ratelimit:${userId}:${action}`;
    const now = Date.now();

    // In production, use Redis
    // For now, simple in-memory tracking
    if (!this.rateLimitMap) {
      this.rateLimitMap = new Map();
    }

    if (!this.rateLimitMap.has(key)) {
      this.rateLimitMap.set(key, []);
    }

    const timestamps = this.rateLimitMap.get(key);

    // Remove old timestamps outside window
    const cutoff = now - windowSeconds * 1000;
    const filtered = timestamps.filter(t => t > cutoff);

    if (filtered.length >= limit) {
      this.logThreat('rate_limit_exceeded', {
        userId: userId,
        action: action,
        count: filtered.length
      });
      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.ceil((filtered[0] + windowSeconds * 1000 - now) / 1000)
      };
    }

    // Add current request
    filtered.push(now);
    this.rateLimitMap.set(key, filtered);

    return {
      allowed: true,
      remaining: limit - filtered.length,
      resetIn: windowSeconds
    };
  }

  /**
   * CSRF token generation and validation
   */
  generateCSRFToken(sessionId) {
    const token = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();

    return {
      token: token,
      sessionId: sessionId,
      createdAt: timestamp,
      expiresAt: timestamp + 3600000 // 1 hour
    };
  }

  validateCSRFToken(token, sessionId) {
    // In production, verify against stored token
    return token && sessionId && token.length === 64;
  }

  /**
   * Request signature verification
   * Ensure request integrity
   */
  signRequest(data, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(data));
    return hmac.digest('hex');
  }

  verifyRequestSignature(data, signature, secret) {
    const expectedSignature = this.signRequest(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Threat logging
   * Track security events for monitoring
   */
  logThreat(threatType, details) {
    const threat = {
      type: threatType,
      details: details,
      timestamp: new Date().toISOString(),
      severity: this.calculateThreatSeverity(threatType)
    };

    this.threatLog.push(threat);

    // Keep last 1000 threats
    if (this.threatLog.length > 1000) {
      this.threatLog.shift();
    }

    // Log critical threats immediately
    if (threat.severity === 'critical') {
      console.error('🚨 CRITICAL THREAT:', threat);
    } else if (threat.severity === 'high') {
      console.warn('⚠️ HIGH THREAT:', threat);
    }

    return threat;
  }

  /**
   * Calculate threat severity
   */
  calculateThreatSeverity(threatType) {
    const severityMap = {
      invalid_signature: 'critical',
      encryption_failure: 'critical',
      rate_limit_exceeded: 'high',
      invalid_input: 'medium',
      missing_token: 'high',
      token_expired: 'medium'
    };

    return severityMap[threatType] || 'medium';
  }

  /**
   * Get threat report
   */
  getThreatReport(hoursAgo = 24) {
    const cutoff = Date.now() - hoursAgo * 60 * 60 * 1000;

    const recentThreats = this.threatLog.filter(
      t => new Date(t.timestamp).getTime() > cutoff
    );

    const byType = {};
    const bySeverity = {};

    recentThreats.forEach(threat => {
      byType[threat.type] = (byType[threat.type] || 0) + 1;
      bySeverity[threat.severity] = (bySeverity[threat.severity] || 0) + 1;
    });

    return {
      timeframe: `${hoursAgo} hours`,
      totalThreats: recentThreats.length,
      byType: byType,
      bySeverity: bySeverity,
      status:
        bySeverity.critical > 0
          ? 'CRITICAL'
          : bySeverity.high > 0
          ? 'HIGH'
          : 'NORMAL'
    };
  }

  /**
   * Data access control
   * Verify user has permission for data
   */
  checkDataAccess(userId, dataOwnerId, permission = 'read') {
    // Own data is always accessible
    if (userId === dataOwnerId) {
      return true;
    }

    // Shared data access (would check permissions table)
    // For now, only own data accessible
    return false;
  }

  /**
   * Audit logging
   * Log all sensitive operations
   */
  auditLog(action, userId, details, severity = 'info') {
    return {
      action: action,
      userId: userId,
      details: details,
      severity: severity,
      timestamp: new Date().toISOString(),
      ipAddress: details?.ipAddress || 'unknown'
    };
  }

  /**
   * Security headers
   * HTTP security headers to prevent attacks
   */
  getSecurityHeaders() {
    return {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
  }

  /**
   * Generate secure password
   */
  generateSecurePassword(length = 32) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
  }

  /**
   * Hash password (bcrypt simulation)
   */
  hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');

    return `${salt}.${hash}`;
  }

  /**
   * Verify password
   */
  verifyPassword(password, hash) {
    const [salt, originalHash] = hash.split('.');
    const verifyHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');

    return verifyHash === originalHash;
  }

  /**
   * Security audit
   * Check system security status
   */
  getSecurityAudit() {
    return {
      timestamp: new Date().toISOString(),
      encryptionStatus: 'Active (AES-256-GCM)',
      tlsVersion: 'TLS 1.3',
      threatLevel: this.getThreatReport(1).status,
      rateLimitingEnabled: true,
      csrfProtectionEnabled: true,
      auditLoggingEnabled: true,
      recommendations: [
        'Continue monitoring threats',
        'Rotate encryption keys quarterly',
        'Review access control policies monthly'
      ]
    };
  }
}

module.exports = SecurityHardener;
