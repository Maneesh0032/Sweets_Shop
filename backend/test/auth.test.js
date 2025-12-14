const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Auth API Tests', () => {

  beforeAll(async () => {
    await db.initialize();
  });

  afterAll( () => {
     db.close(); // IMPORTANT: await to avoid Jest warning
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'test123',
          confirmPassword: 'test123',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toMatch(/registered/i);
    });

    test('should fail if passwords do not match', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'failuser@example.com',
          password: 'test123',
          confirmPassword: 'wrong123',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@gmail.com',
          password: 'admin',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    test('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@gmail.com',
          password: 'wrongpassword',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBeDefined();
    });
  });

});
