import request from 'supertest';
import { getTestToken } from './generateToken';
const baseURL = 'http://localhost:3000/api/private/owner/';

let TEST_TOKEN = '';

beforeAll(async () => {
  TEST_TOKEN = `Bearer ${await getTestToken()}`;
});

describe('GET / without access token', () => {
  it('should return 401', async () => {
    const response = await request(baseURL).get('/');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});

describe('GET / with access token but no account in db', () => {
  it('should return 404', async () => {
    const response = await request(baseURL).get('/').set('Authorization', TEST_TOKEN);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Account not found');
  });
});

describe('POST /signup without username', () => {
  it('should return 400', async () => {
    const response = await request(baseURL).post('/signup').set('Authorization', TEST_TOKEN).send();
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Username missing');
  });
});

describe('POST /signup with all information', () => {
  it('should insert Owner in db', async () => {
    const response = await request(baseURL).post('/signup').set('Authorization', TEST_TOKEN).send({ username: 'test', name: 'test test' });
    expect(response.statusCode).toBe(200);
  });
});

describe('GET / with access token and account in db', () => {
  it('should return Owner json', async () => {
    const response = await request(baseURL).get('/').set('Authorization', TEST_TOKEN);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('test');
    expect(response.body.name).toBe('test test');
  });
});
