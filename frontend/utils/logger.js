/**
 * Frontend Logger - Centralized Logging
 */

class FrontendLogger {
  constructor() {
    this.isDev = true; // Set to false in production
  }

  log(message, data = {}) {
    console.log(`📝 ${message}`, data);
  }

  info(message, data = {}) {
    console.info(`ℹ️ ${message}`, data);
  }

  warn(message, data = {}) {
    console.warn(`⚠️ ${message}`, data);
  }

  error(message, error = null) {
    console.error(`❌ ${message}`, error);
    
    // In production, send to logging service
    if (!this.isDev && error) {
      this.sendToServer(message, error);
    }
  }

  success(message, data = {}) {
    console.log(`✅ ${message}`, data);
  }

  debug(message, data = {}) {
    if (this.isDev) {
      console.debug(`🐛 ${message}`, data);
    }
  }

  async sendToServer(message, error) {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          message,
          error: error.toString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (e) {
      console.error('Failed to send log to server');
    }
  }
}

const logger = new FrontendLogger();

export default logger;
