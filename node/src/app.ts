import express from 'express';
import { setTimeout as delay } from 'node:timers/promises';
import { createTokenService } from './tokens.js';
export function createApp(service = createTokenService()) {
  const app = express();
  app.disable('x-powered-by');
  // Only the local demo origins can call the optional API from a browser.
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      if (!/^http:\/\/127\.0\.0\.1:(3000|4300|4400)$/.test(origin)) {
        res.sendStatus(403);
        return;
      }
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });
  app.use(express.json({ limit: '4kb' }));
  app.post('/login', (_req, res) => {
    res.json(service.login());
  });
  app.post('/refresh', async (req, res) => {
    if (typeof req.body?.refreshToken !== 'string') {
      res.status(400).json({ error: 'refresh_token_required' });
      return;
    }
    await delay(80);
    const result = service.refresh(req.body.refreshToken);
    res.status(result.ok ? 200 : 401).json(result.ok ? result.value : { error: result.error });
  });
  app.get('/tasks', async (req, res) => {
    await delay(20);
    const token = req.headers.authorization?.replace(/^Bearer /, '') ?? '';
    const list = typeof req.query.list === 'string' ? req.query.list : 'all';
    const result = service.tasks(token, list);
    res.status(result.ok ? 200 : 401).json(result.ok ? result.value : { error: result.error });
  });
  return app;
}
