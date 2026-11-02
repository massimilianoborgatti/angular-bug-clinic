import { copyFile, mkdir } from 'node:fs/promises';
await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await copyFile(
  new URL('../node_modules/msw/lib/mockServiceWorker.js', import.meta.url),
  new URL('../public/mockServiceWorker.js', import.meta.url),
);
