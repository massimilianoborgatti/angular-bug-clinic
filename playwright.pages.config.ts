import { defineConfig } from '@playwright/test';
import config from './playwright.config';
export default defineConfig({
  ...config,
  use: {
    ...config.use,
    baseURL: process.env['PAGES_URL'] ?? 'http://127.0.0.1:4300/angular-bug-clinic/',
  },
  webServer: process.env['PAGES_URL']
    ? undefined
    : {
        command: 'node scripts/serve-pages.mjs',
        url: 'http://127.0.0.1:4300/angular-bug-clinic/',
        reuseExistingServer: false,
      },
});
