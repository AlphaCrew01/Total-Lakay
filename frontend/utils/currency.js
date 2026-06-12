/**
 * Currency Management Module
 * Exchange rates and currency conversion
 */

class CurrencyManager {
  constructor() {
    this.rates = {
      HTG: 1,
      USD: 1 / 135,
      EUR: 1 / 140
    };
    this.lastUpdate = 0;
    this.updateInterval = 6 * 60 * 60 * 1000; // 6 hours
    this.observers = [];
  }

  /**
   * Get current exchange rates
   */
  getRates() {
    return { ...this.rates };
  }

  /**
   * Get specific rate
   */
  getRate(currency) {
    return this.rates[currency] || null;
  }

  /**
   * Update rates from backend API
   */
  async updateRates() {
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - this.lastUpdate < this.updateInterval) {
      console.log('📊 Using cached exchange rates');
      return;
    }

    try {
      console.log('🔄 Fetching fresh exchange rates...');
      const response = await fetch('/api/exchange-rates');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      const data = await response.json();
      
      if (data.rates) {
        this.rates = data.rates;
        this.lastUpdate = now;
        this.notifyObservers();
        console.log('✅ Exchange rates updated', this.rates);
      }
    } catch (error) {
      console.warn('⚠️ Failed to update exchange rates:', error.message);
      console.warn('📊 Using fallback rates');
    }
  }

  /**
   * Convert amount between currencies
   */
  convert(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = this.rates[fromCurrency];
    const toRate = this.rates[toCurrency];

    if (!fromRate || !toRate) {
      console.warn(`❌ Unsupported currency: ${fromCurrency} or ${toCurrency}`);
      return amount;
    }

    // Convert to base (HTG) then to target
    const baseAmount = amount / fromRate;
    const convertedAmount = baseAmount * toRate;

    return Math.round(convertedAmount * 100) / 100;
  }

  /**
   * Format amount for display
   */
  format(amount, currency = 'HTG') {
    const formatters = {
      HTG: new Intl.NumberFormat('ht-HT', {
        style: 'currency',
        currency: 'HTG'
      }),
      USD: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }),
      EUR: new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      })
    };

    return formatters[currency]?.format(amount) || `${currency} ${amount}`;
  }

  /**
   * Subscribe to rate changes
   */
  subscribe(callback) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  notifyObservers() {
    this.observers.forEach(callback => callback(this.rates));
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies() {
    return Object.keys(this.rates);
  }
}

const currencyManager = new CurrencyManager();

// Auto-update on initialization
currencyManager.updateRates();

export default currencyManager;
