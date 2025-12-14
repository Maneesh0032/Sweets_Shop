const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

let token;

beforeAll(async () => {
  await db.initialize();

  const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'user@gmail.com',
      password: 'user123',
    });

  token = login.body.token;
});

afterAll(async () => {
  await db.close();
});


describe('TDD: Purchase Sweet', () => {
  test('should decrease sweet quantity by 1 after purchase', async () => {
    const before = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`);

    const initialQty = before.body[0].quantity;

    const purchase = await request(app)
      .post(`/api/sweets/${before.body[0].id}/purchase`)
      .set('Authorization', `Bearer ${token}`);

    expect(purchase.statusCode).toBe(200);

    const after = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`);

    expect(after.body[0].quantity).toBe(initialQty - 1);
  });
});
