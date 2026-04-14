/**
 * FINN LOGGING SERVICE
 * Centralized logging, monitoring, and error tracking
 */

import { LOGGING_CONFIG, ENVIRONMENT } from './config';

class LoggingService {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
    this.config = LOGGING_CONFIG;
  }

  /**
   * Log levels
   */
  static LEVELS = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    CRITICAL: 'CRITICAL'
  };

  /**
   * Get log level priority
   */
  getLogPriority(level) {
    const priorities = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      CRITICAL: 4
    };
    return priorities[level] || 1;
  }

  /**
   * Should log based on level
   */
  shouldLog(level) {
    const configLevel = this.config.level;
    return this.getLogPriority(level) >= this.getLogPriority(configLevel);
  }

  /**
   * Format log message
   */
  formatMessage(level, message, data = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
      user: this.getCurrentUser()
    };
  }

  /**
   * Get current user info
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem('finn_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /**
   * Debug log
   */
  debug(message, data = {}) {
    if (!this.shouldLog('DEBUG')) return;
    const log = this.formatMessage('DEBUG', message, data);
    this.storeLog(log);
    if (this.config.enableConsole) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  /**
   * Info log
   */
  info(message, data = {}) {
    if (!this.shouldLog('INFO')) return;
    const log = this.formatMessage('INFO', message, data);
    this.storeLog(log);
    if (this.config.enableConsole) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  /**
   * Warning log
   */
  warn(message, data = {}) {
    if (!this.shouldLog('WARN')) return;
    const log = this.formatMessage('WARN', message, data);
    this.storeLog(log);
    if (this.config.enableConsole) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  /**
   * Error log
   */
  error(message, error = null, data = {}) {
    if (!this.shouldLog('ERROR')) return;
    const errorData = {
      ...data,
      errorMessage: error?.message,
      errorStack: error?.stack
    };
    const log = this.formatMessage('ERROR', message, errorData);
    this.storeLog(log);
    if (this.config.enableConsole) {
      console.error(`[ERROR] ${message}`, error, data);
    }
    if (this.config.enableRemote) {
      this.sendToRemote(log);
    }
  }

  /**
   * Critical log
   */
  critical(message, error = null, data = {}) {
    const errorData = {
      ...data,
      errorMessage: error?.message,
      errorStack: error?.stack
    };
    const log = this.formatMessage('CRITICAL', message, errorData);
    this.storeLog(log);
    if (this.config.enableConsole) {
      console.error(`[CRITICAL] ${message}`, error, data);
    }
    if (this.config.enableRemote) {
      this.sendToRemote(log);
    }
  }

  /**
   * Store log locally
   */
  storeLog(log) {
    this.logs.push(log);
    
    // Keep only max logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('finn_logs', JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Failed to store logs in localStorage');
    }
  }

  /**
   * Send log to remote server
   */
  async sendToRemote(log) {
    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
    } catch (error) {
      console.error('Failed to send log to remote:', error);
    }
  }

  /**
   * Get all logs
   */
  getLogs(level = null) {
    if (!level) {
      return this.logs;
    }
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs by time range
   */
  getLogsByTimeRange(startTime, endTime) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= start && logTime <= end;
    });
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('finn_logs');
  }

  /**
   * Export logs
   */
  exportLogs(format = 'json') {
    if (format === 'csv') {
      return this.logsToCSV();
    }
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Convert logs to CSV
   */
  logsToCSV() {
    if (this.logs.length === 0) return '';

    const headers = ['Timestamp', 'Level', 'Message', 'Data', 'User'];
    const rows = this.logs.map(log => [
      log.timestamp,
      log.level,
      log.message,
      JSON.stringify(log.data),
      log.user?.id || 'Unknown'
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csv;
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    if (!window.performance) return;

    // Monitor page load
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      this.info('Page loaded', { loadTime: pageLoadTime + 'ms' });
    });

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              this.warn('Long task detected', {
                duration: entry.duration + 'ms',
                name: entry.name
              });
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long tasks not supported
      }
    }
  }

  /**
   * Monitor API calls
   */
  monitorAPICall(method, url, duration, status) {
    const level = status >= 400 ? 'WARN' : 'INFO';
    const message = `API ${method} ${url}`;
    this[level](message, { duration, status });
  }

  /**
   * Monitor errors globally
   */
  setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.error('Uncaught Error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', event.reason, {
        promise: event.promise
      });
    });
  }
}

// Export singleton
const logger = new LoggingService();

// Setup handlers if in browser
if (typeof window !== 'undefined') {
  logger.setupGlobalErrorHandler();
  logger.setupPerformanceMonitoring();
}

export default logger;
