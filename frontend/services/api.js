/**
 * API Client Module
 * Centralized API communication with error handling
 */

import logger from '../utils/logger.js';

class APIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      timeout = 10000
    } = options;

    const url = this.baseURL + endpoint;
    const finalHeaders = { ...this.defaultHeaders, ...headers };

    logger.debug(`📡 API Request: ${method} ${endpoint}`, body);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : null,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      logger.debug(`✅ API Response: ${method} ${endpoint}`, data);

      return { success: true, data };
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.error(`⏱️ API timeout: ${endpoint}`, error);
        return { success: false, error: 'Request timeout' };
      }

      logger.error(`❌ API Error: ${endpoint}`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

const apiClient = new APIClient(
  process.env.VITE_BACKEND_URL || 'http://localhost:3001'
);

/**
 * MonCash Payment API
 */
const moncashAPI = {
  async createPayment(orderId, phone, amount, currency, userEmail = '') {
    return apiClient.post('/api/moncash/create-payment', {
      orderId,
      phone,
      amount,
      currency,
      userEmail,
      description: `Paiement MonCash pour commande ${orderId}`
    });
  },

  async verifyPayment(orderId, paymentReference) {
    return apiClient.post('/api/moncash/verify-payment', {
      orderId,
      paymentReference
    });
  }
};

/**
 * Exchange Rates API
 */
const exchangeRatesAPI = {
  async fetchRates() {
    return apiClient.get('/api/exchange-rates');
  }
};

export {
  APIClient,
  apiClient,
  moncashAPI,
  exchangeRatesAPI
};
