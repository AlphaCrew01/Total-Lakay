const fetch = require('node-fetch');
const logger = require('./logger');

// Cache for exchange rates (in memory, expires every 6 hours)
let exchangeRateCache = {
  rates: { HTG: 1, USD: 1/135, EUR: 1/140 },
  timestamp: 0,
  TTL: 6 * 60 * 60 * 1000 // 6 hours
};

/**
 * Get exchange rates from API or cache
 * @returns {Promise<Object>} Exchange rates object
 */
async function getExchangeRates() {
  const now = Date.now();
  
  // Return cached if not expired
  if (now - exchangeRateCache.timestamp < exchangeRateCache.TTL) {
    logger.debug('Using cached exchange rates');
    return exchangeRateCache.rates;
  }

  try {
    logger.info('Fetching fresh exchange rates from API');
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const apiUrl = process.env.EXCHANGE_RATE_API_URL;

    if (!apiKey || !apiUrl) {
      logger.warn('Exchange rate API not configured, using fallback rates');
      return exchangeRateCache.rates;
    }

    const response = await fetch(`${apiUrl}?app_id=${apiKey}&symbols=USD,EUR,HTG&base=HTG`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (data.rates) {
      exchangeRateCache.rates = {
        HTG: 1,
        USD: data.rates.USD || 1/135,
        EUR: data.rates.EUR || 1/140
      };
      exchangeRateCache.timestamp = now;
      logger.info('Exchange rates updated successfully', { rates: exchangeRateCache.rates });
    }

    return exchangeRateCache.rates;
  } catch (error) {
    logger.warn('Failed to fetch exchange rates, using cache', { error: error.message });
    return exchangeRateCache.rates;
  }
}

/**
 * Convert amount from one currency to another
 * @param {number} amount Amount to convert
 * @param {string} fromCurrency Source currency
 * @param {string} toCurrency Target currency
 * @returns {Promise<number>} Converted amount
 */
async function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  
  try {
    const rates = await getExchangeRates();
    
    if (!rates[fromCurrency] || !rates[toCurrency]) {
      throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
    }

    // Convert to base (HTG) then to target
    const baseAmount = amount / rates[fromCurrency];
    const convertedAmount = baseAmount * rates[toCurrency];
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimals
  } catch (error) {
    logger.error('Currency conversion failed', { error: error.message, amount, fromCurrency, toCurrency });
    throw error;
  }
}

module.exports = {
  getExchangeRates,
  convertCurrency
};
