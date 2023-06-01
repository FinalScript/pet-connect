import request from 'supertest';
const baseURL = 'http://localhost:3000/api/private/pet/';

const TEST_TOKEN = 'Bearer ' + process.env.API_TEST_TOKEN;

describe('GET / without access token', () => {
  it('should return 401', async () => {
    const response = await request(baseURL).get('/');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});

describe('GET / with access token but no "id"', () => {
  it('should return 400', async () => {
    const response = await request(baseURL).get('/').set('Authorization', TEST_TOKEN);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('id not provided');
  });
});

describe('POST /create without name', () => {
  it('should return 400', async () => {
    const response = await request(baseURL).post('/create').set('Authorization', TEST_TOKEN).send({ type: 'DOG' });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Name missing');
  });
});

describe('POST /create without type', () => {
  it('should return 400', async () => {
    const response = await request(baseURL).post('/create').set('Authorization', TEST_TOKEN).send({ name: 'Max' });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Type missing');
  });
});

describe('POST /create with valid name and type', () => {
  it('should return 200', async () => {
    const response = await request(baseURL).post('/create').set('Authorization', TEST_TOKEN).send({ name: 'Max', type: 'DOG' });
    expect(response.statusCode).toBe(200);
  });
});
