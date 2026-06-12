/**
 * Tests for MonCash Payment API
 */

const request = require('supertest');
const app = require('./server');

describe('MonCash Payment API', () => {
  describe('POST /api/moncash/create-payment', () => {
    test('should reject request with missing fields', async () => {
      const res = await request(app)
        .post('/api/moncash/create-payment')
        .send({
          orderId: 'ORD-001'
          // Missing phone, amount, currency
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject invalid phone number', async () => {
      const res = await request(app)
        .post('/api/moncash/create-payment')
        .send({
          orderId: 'ORD-001',
          phone: '123', // Invalid
          amount: 100,
          currency: 'HTG'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject negative amount', async () => {
      const res = await request(app)
        .post('/api/moncash/create-payment')
        .send({
          orderId: 'ORD-001',
          phone: '+50912345678',
          amount: -100,
          currency: 'HTG'
        });

      expect(res.status).toBe(400);
    });

    test('should reject invalid currency', async () => {
      const res = await request(app)
        .post('/api/moncash/create-payment')
        .send({
          orderId: 'ORD-001',
          phone: '+50912345678',
          amount: 100,
          currency: 'XXX' // Invalid
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/moncash/verify-payment', () => {
    test('should reject request with missing fields', async () => {
      const res = await request(app)
        .post('/api/moncash/verify-payment')
        .send({
          orderId: 'ORD-001'
          // Missing paymentReference
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const res = await request(app)
        .get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.backend).toBeDefined();
      expect(res.body.version).toBeDefined();
    });
  });
});

describe('Rate Limiting', () => {
  test('should limit payment requests', async () => {
    // Make multiple requests
    for (let i = 0; i < 11; i++) {
      const res = await request(app)
        .post('/api/moncash/create-payment')
        .send({
          orderId: `ORD-${i}`,
          phone: '+50912345678',
          amount: 100,
          currency: 'HTG'
        });

      // After 10 requests, should be rate limited
      if (i >= 10) {
        expect(res.status).toBe(429);
      }
    }
  });
});
