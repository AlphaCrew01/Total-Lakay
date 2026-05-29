require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const MONCASH_API_BASE_URL = process.env.MONCASH_API_BASE_URL;
const MONCASH_CLIENT_ID = process.env.MONCASH_CLIENT_ID;
const MONCASH_CLIENT_SECRET = process.env.MONCASH_CLIENT_SECRET;
const MONCASH_CREATE_PATH = process.env.MONCASH_CREATE_PATH || '/payments';
const MONCASH_VERIFY_PATH = process.env.MONCASH_VERIFY_PATH || '/payments/verify';
const MONCASH_CREATE_METHOD = process.env.MONCASH_CREATE_METHOD || 'POST';
const MONCASH_VERIFY_METHOD = process.env.MONCASH_VERIFY_METHOD || 'POST';

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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', backend: 'MonCash helper', timestamp: new Date().toISOString() });
});

app.post('/api/moncash/create-payment', async (req, res) => {
  const { orderId, userId, userEmail, phone, amount, currency, description } = req.body || {};

  if (!orderId || !phone || !amount || !currency) {
    return res.status(400).json({ success: false, error: 'Missing required MonCash payload.' });
  }

  if (!MONCASH_API_BASE_URL || !MONCASH_CLIENT_ID || !MONCASH_CLIENT_SECRET) {
    return res.status(500).json({ success: false, error: 'MonCash server credentials not configured.' });
  }

  try {
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

    await db.collection('moncash_requests').add({
      orderId,
      userId,
      userEmail,
      phone,
      amount,
      currency,
      description,
      reference: paymentReference,
      status,
      provider: 'MonCash',
      requestPayload: body,
      responsePayload: result,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({ success: true, reference: paymentReference, status, result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/moncash/verify-payment', async (req, res) => {
  const { orderId, paymentReference } = req.body || {};
  if (!orderId || !paymentReference) {
    return res.status(400).json({ success: false, error: 'Missing orderId or paymentReference.' });
  }

  if (!MONCASH_API_BASE_URL || !MONCASH_CLIENT_ID || !MONCASH_CLIENT_SECRET) {
    return res.status(500).json({ success: false, error: 'MonCash server credentials not configured.' });
  }

  try {
    const verifyBody = { reference: paymentReference, orderId };
    const result = await callMoncashApi(MONCASH_VERIFY_PATH, MONCASH_VERIFY_METHOD, verifyBody);
    const status = result.status || 'pending';

    await db.collection('moncash_requests').add({
      orderId,
      paymentReference,
      status,
      provider: 'MonCash',
      responsePayload: result,
      verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({ success: true, status, result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Total Lakay backend running on port ${port}`);
});
