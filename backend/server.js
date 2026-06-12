require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

// Import security & utilities
const logger = require('./utils/logger');
const { corsOptions, limiter, paymentLimiter, securityHeaders } = require('./middleware/securityMiddleware');
const { createPaymentSchema, verifyPaymentSchema } = require('./validators/paymentValidator');
const { getExchangeRates, convertCurrency } = require('./utils/currencyConverter');

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// CORS with proper configuration
app.use(cors(corsOptions));

// Rate limiting
app.use(limiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const MONCASH_API_BASE_URL = process.env.MONCASH_API_BASE_URL;
const MONCASH_CLIENT_ID = process.env.MONCASH_CLIENT_ID;
const MONCASH_CLIENT_SECRET = process.env.MONCASH_CLIENT_SECRET;
const MONCASH_CREATE_PATH = process.env.MONCASH_CREATE_PATH || '/payments';
const MONCASH_VERIFY_PATH = process.env.MONCASH_VERIFY_PATH || '/payments/verify';
const MONCASH_CREATE_METHOD = process.env.MONCASH_CREATE_METHOD || 'POST';
const MONCASH_VERIFY_METHOD = process.env.MONCASH_VERIFY_METHOD || 'POST';
const BACKEND_PORT = process.env.BACKEND_PORT || 3001;

// Validate required configuration
const missingEnvVars = [];
if (!FIREBASE_SERVICE_ACCOUNT_KEY) missingEnvVars.push('FIREBASE_SERVICE_ACCOUNT_KEY');
if (!MONCASH_API_BASE_URL) missingEnvVars.push('MONCASH_API_BASE_URL');
if (!MONCASH_CLIENT_ID) missingEnvVars.push('MONCASH_CLIENT_ID');
if (!MONCASH_CLIENT_SECRET) missingEnvVars.push('MONCASH_CLIENT_SECRET');

if (missingEnvVars.length > 0) {
  logger.error('Missing critical environment variables:', { vars: missingEnvVars });
  logger.error('Please configure all required variables in .env file');
  process.exit(1);
}

if (FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    process.exit(1);
  }
} else {
  admin.initializeApp();
}

const db = admin.firestore();

function getMoncashAuthHeader() {
  if (!MONCASH_CLIENT_ID || !MONCASH_CLIENT_SECRET) return null;
  const token = Buffer.from(`${MONCASH_CLIENT_ID}:${MONCASH_CLIENT_SECRET}`).toString('base64');
  return `Basic ${token}`;
}

async function callMoncashApi(path, method = 'POST', body = null) {
  if (!MONCASH_API_BASE_URL) {
    throw new Error('MONCASH_API_BASE_URL n’est pas configuré.');
  }

  const url = new URL(path, MONCASH_API_BASE_URL);
  const headers = { 'Content-Type': 'application/json' };
  const authHeader = getMoncashAuthHeader();
  if (authHeader) headers.Authorization = authHeader;

  const options = { method, headers };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  if (body && method === 'GET') {
    for (const [key, value] of Object.entries(body)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = payload.error || payload.message || response.statusText;
    throw new Error(`MonCash API error: ${error}`);
  }

  return payload;
}

// ============================================
// ROUTES
// ============================================

// Exchange Rates endpoint
app.get('/api/exchange-rates', async (req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json({
      success: true,
      rates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Exchange rates fetch failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exchange rates'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    backend: 'Total Lakay MonCash Helper',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    requestId: req.id
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
const PORT = BACKEND_PORT;
app.listen(PORT, () => {
  logger.info(`🚀 Total Lakay Backend Server started`, {
    port: PORT,
    environment: process.env.NODE_ENV,
    moncashConfigured: !!MONCASH_API_BASE_URL,
    firebaseConfigured: !!FIREBASE_SERVICE_ACCOUNT_KEY
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Export for testing
module.exports = app;

app.post('/api/moncash/create-payment', paymentLimiter, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createPaymentSchema.validate(req.body);
    
    if (error) {
      logger.warn('Invalid payment creation request', { 
        error: error.details[0].message,
        ip: req.ip
      });
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }

    const { orderId, userId, userEmail, phone, amount, currency, description } = value;

    logger.info('Processing payment creation', { orderId, phone, amount, currency });

    const body = {
      amount,
      currency,
      phone,
      reference: orderId,
      description: description || `Paiement MonCash pour commande ${orderId}`
    };

    const result = await callMoncashApi(MONCASH_CREATE_PATH, MONCASH_CREATE_METHOD, body);
    const paymentReference = result.reference || result.id || orderId;
    const status = result.status || 'pending';

    // Log payment request in Firestore
    await db.collection('moncash_requests').add({
      orderId,
      userId,
      userEmail,
      phone: phone.slice(-8), // Hash last 8 digits for privacy
      amount,
      currency,
      reference: paymentReference,
      status,
      provider: 'MonCash',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logger.info('Payment created successfully', { orderId, paymentReference, status });

    return res.json({ 
      success: true, 
      reference: paymentReference, 
      status, 
      result 
    });
  } catch (error) {
    logger.error('Payment creation failed', { 
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      success: false, 
      error: 'Payment processing failed. Please try again.' 
    });
  }
});

app.post('/api/moncash/verify-payment', paymentLimiter, async (req, res) => {
  try {
    // Validate request
    const { error, value } = verifyPaymentSchema.validate(req.body);
    
    if (error) {
      logger.warn('Invalid payment verification request', { 
        error: error.details[0].message 
      });
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }

    const { orderId, paymentReference } = value;

    logger.info('Verifying payment', { orderId, paymentReference });

    const verifyBody = { reference: paymentReference, orderId };
    const result = await callMoncashApi(MONCASH_VERIFY_PATH, MONCASH_VERIFY_METHOD, verifyBody);
    const status = result.status || 'pending';

    // Log verification
    await db.collection('moncash_requests').add({
      orderId,
      paymentReference,
      status,
      provider: 'MonCash',
      verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logger.info('Payment verified', { orderId, status });

    return res.json({ success: true, status, result });
  } catch (error) {
    logger.error('Payment verification failed', { 
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      success: false, 
      error: 'Payment verification failed. Please try again.' 
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Total Lakay backend running on port ${port}`);
});
