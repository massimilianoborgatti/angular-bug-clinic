import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
const root = resolve('out');
const prefix = '/angular-bug-clinic/react/';
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      if (url.pathname === prefix.slice(0, -1)) {
        res.writeHead(301, { Location: prefix });
        return res.end();
      }
      if (!url.pathname.startsWith(prefix)) {
        res.writeHead(404);
        return res.end('Not found');
      }
      let relative = decodeURIComponent(url.pathname.slice(prefix.length));
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      const path = resolve(root, relative);
      if (!path.startsWith(root + sep)) throw new Error('Invalid path');
      const data = await readFile(path);
      const type = types[extname(path)] ?? 'application/octet-stream';
      const compress =
        process.env.STATIC_GZIP === '1' &&
        /text\/|json|svg/.test(type) &&
        /gzip/.test(req.headers['accept-encoding'] || '');
      res.writeHead(200, {
        'Content-Type': type,
        ...(compress ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}),
      });
      res.end(compress ? gzipSync(data) : data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  })
  .listen(4400, '127.0.0.1', () => console.log('Static preview: http://127.0.0.1:4400' + prefix));
