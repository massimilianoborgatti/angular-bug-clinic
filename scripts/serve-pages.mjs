import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist/angular-bug-clinic/browser');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      if (!url.pathname.startsWith('/angular-bug-clinic/')) {
        res.writeHead(404);
        return res.end();
      }
      let relative =
        decodeURIComponent(url.pathname.slice('/angular-bug-clinic/'.length)) || 'index.html';
      if (relative.endsWith('/')) relative += 'index.html';
      const path = resolve(root, relative);
      if (!path.startsWith(root + sep)) throw new Error('Invalid path');
      const data = await readFile(path);
      res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  })
  .listen(4300, '127.0.0.1', () =>
    console.log('Pages preview: http://127.0.0.1:4300/angular-bug-clinic/'),
  );
