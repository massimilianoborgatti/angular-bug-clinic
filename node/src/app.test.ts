import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from './app.js';
import { ACCESS_LIFETIME_MS, createTokenService } from './tokens.js';
function setup() {
  let time = 1_000;
  const app = createApp(createTokenService(() => time));
  return {
    api: request(app),
    expire: () => {
      time += ACCESS_LIFETIME_MS;
    },
  };
}
describe('rotating demo sessions', () => {
  it('logs in and returns tasks only for a valid bearer token', async () => {
    const { api } = setup();
    await api.get('/tasks').expect(401);
    const { body } = await api.post('/login').expect(200);
    expect(body.accessToken).not.toBe(body.refreshToken);
    const response = await api
      .get('/tasks?list=today')
      .auth(body.accessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body.tasks).toHaveLength(1);
    expect(response.body.tasks[0].list).toBe('today');
  });
  it('rejects an expired access token at its exact expiry', async () => {
    const { api, expire } = setup();
    const { body } = await api.post('/login');
    expire();
    const response = await api.get('/tasks').auth(body.accessToken, { type: 'bearer' }).expect(401);
    expect(response.body.error).toBe('token_expired');
  });
  it('rotates both tokens and accepts the new access token', async () => {
    const { api, expire } = setup();
    const { body: first } = await api.post('/login');
    expire();
    const { body: second } = await api
      .post('/refresh')
      .send({ refreshToken: first.refreshToken })
      .expect(200);
    expect(second.accessToken).not.toBe(first.accessToken);
    expect(second.refreshToken).not.toBe(first.refreshToken);
    await api.get('/tasks').auth(second.accessToken, { type: 'bearer' }).expect(200);
  });
  it('reuse revokes the entire family, including newly issued tokens', async () => {
    const { api } = setup();
    const { body: first } = await api.post('/login');
    const { body: second } = await api.post('/refresh').send({ refreshToken: first.refreshToken });
    const reused = await api
      .post('/refresh')
      .send({ refreshToken: first.refreshToken })
      .expect(401);
    expect(reused.body.error).toBe('refresh_reused');
    await api.get('/tasks').auth(second.accessToken, { type: 'bearer' }).expect(401);
    const revoked = await api
      .post('/refresh')
      .send({ refreshToken: second.refreshToken })
      .expect(401);
    expect(revoked.body.error).toBe('session_revoked');
    const fresh = await api.post('/login');
    await api.get('/tasks').auth(fresh.body.accessToken, { type: 'bearer' }).expect(200);
  });
  it('rejects missing and unknown refresh tokens', async () => {
    const { api } = setup();
    await api.post('/refresh').send({}).expect(400);
    const unknown = await api
      .post('/refresh')
      .send({ refreshToken: 'unknown-demo-token' })
      .expect(401);
    expect(unknown.body.error).toBe('invalid_token');
  });
  it('permits local demo preflight and rejects other origins', async () => {
    const { api } = setup();
    const allowed = await api
      .options('/refresh')
      .set('Origin', 'http://127.0.0.1:4400')
      .expect(204);
    expect(allowed.headers['access-control-allow-origin']).toBe('http://127.0.0.1:4400');
    await api.post('/login').set('Origin', 'https://example.test').expect(403);
  });
});
