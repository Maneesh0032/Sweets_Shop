const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

let token;
let adminToken;
let sweetId;

beforeAll(async () => {
  await db.initialize();

  const userLogin = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'user@gmail.com',
      password: 'user123',
    });
  token = userLogin.body.token;

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@gmail.com',
      password: 'admin',
    });
  adminToken = adminLogin.body.token;
});

afterAll(() => {
  db.close();
});


describe('Sweets API Tests', () => {
  
  describe('GET /api/sweets', () => {
    test('Get all sweets successfully', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('Fail to get sweets without token', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/sweets', () => {
    test('Add new sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Sweet',
          category: 'Sweets',
          price: 2.99,
          quantity: 50,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe('Test Sweet');
      sweetId = response.body.id;
    });

    test('Fail to add sweet as regular user', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Sweet',
          category: 'Sweets',
          price: 2.99,
          quantity: 50,
        });

      expect(response.statusCode).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    test('Purchase a sweet successfully', async () => {
      const response = await request(app)
        .post('/api/sweets/1/purchase')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain('successful');
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    test('Restock a sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets/1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 20 });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain('successful');
    });
  });
});
