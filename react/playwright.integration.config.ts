import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';
import config from './playwright.config';
export default defineConfig({
  ...config,
  testDir: './integration',
  use: { ...config.use, baseURL: 'http://127.0.0.1:4300/angular-bug-clinic/' },
  webServer: {
    command: 'node scripts/serve-pages.mjs',
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    url: 'http://127.0.0.1:4300/angular-bug-clinic/',
    reuseExistingServer: false,
  },
});
