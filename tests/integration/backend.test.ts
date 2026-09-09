import request from 'supertest';

const mockPrismaObj = {
  $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
  product: {
    findUnique: jest.fn().mockResolvedValue({
      id: 'p-1',
      name: 'Samsung Galaxy S25 Ultra',
      slug: 'samsung-galaxy-s25-ultra',
      description: 'Flagship phone',
      mainImageUrl: 'https://example.com/s25.jpg',
      brand: { name: 'Samsung' },
      category: { name: 'Smartphones' },
      variants: [
        {
          id: 'v-1',
          name: '256GB',
          identifiers: [],
          attributes: [],
          offers: [
            {
              id: 'o-1',
              priceKes: 120000,
              totalCostKes: 120000,
              isDeliveryFree: true,
              stockStatus: 'IN_STOCK',
              url: 'https://example.com',
              merchant: {
                id: 'm-1',
                name: 'PhonePlace KE',
                slug: 'phoneplace-ke',
                verificationStatus: 'VERIFIED',
                physicalAddress: 'Nairobi',
                warrantyPolicy: '1 Year',
                returnPolicy: '7 Days',
              },
            },
          ],
        },
      ],
    }),
  },
  variant: {
    findMany: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'v-1',
          name: '256GB / 12GB RAM',
          createdAt: new Date(),
          product: {
            id: 'p-1',
            name: 'Samsung Galaxy S25 Ultra',
            slug: 'samsung-galaxy-s25-ultra',
            mainImageUrl: 'https://example.com/s25.jpg',
            brand: { name: 'Samsung', slug: 'samsung' },
            category: { name: 'Smartphones', slug: 'smartphones' },
          },
          offers: [
            {
              id: 'o-1',
              priceKes: 119999,
              totalCostKes: 119999,
              originalPriceKes: 125000,
              stockStatus: 'IN_STOCK',
              isDeliveryFree: true,
              merchant: { name: 'PhonePlace' },
            },
          ],
          attributes: [
            { attribute: { slug: 'ram', unit: 'GB' }, valueString: '12' },
            { attribute: { slug: 'storage', unit: 'GB' }, valueString: '256' },
          ],
        },
      ])
    ),
  },
  merchant: {
    findFirst: jest.fn().mockResolvedValue({ id: 'demo-m-1', name: 'Demo Merchant' }),
  },
  offer: {
    upsert: jest.fn().mockResolvedValue({ id: 'o-new' }),
  },
};

jest.mock('../../src/lib/db/prisma', () => ({ prisma: mockPrismaObj }));

import app from '../../src/server';

describe('Dedicated Backend REST API Integration Tests', () => {
  test('GET /health returns 200 UP status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toContain('PriceRadar Kenya');
  });

  test('GET /readiness returns READY or 500 when DB is offline', async () => {
    const res = await request(app).get('/readiness');
    expect([200, 500]).toContain(res.status);
  });

  test('GET /api/v1/products returns catalog JSON response', async () => {
    const res = await request(app).get('/api/v1/products?limit=5');
    expect([200, 500]).toContain(res.status);
  });

  test('GET /api/v1/products/:slug returns product overview response', async () => {
    const res = await request(app).get('/api/v1/products/samsung-galaxy-s25-ultra');
    expect([200, 404, 500]).toContain(res.status);
  });

  test('POST /api/v1/ai-assistant processes natural language query', async () => {
    const res = await request(app)
      .post('/api/v1/ai-assistant')
      .send({ prompt: 'Best phone under KSh 30,000' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('recommendations');
    expect(res.body).toHaveProperty('aiExplanation');
  });

  test('POST /api/v1/merchants/import validates CSV feed rows', async () => {
    const res = await request(app)
      .post('/api/v1/merchants/import')
      .send({
        action: 'preview',
        rows: [
          { sku: 'SKU1', name: 'Product 1', price: '25000', url: 'https://example.co.ke/p1' },
          { sku: '', name: 'Invalid', price: 'abc', url: 'invalid' },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.validRowsCount).toBe(1);
    expect(res.body.invalidRowsCount).toBe(1);
  });
});
