import { defineConfig } from '@playwright/test';
import config from './playwright.config.mjs';
export default defineConfig({
  ...config,
  testDir: './screenshots',
  use: {
    ...config.use,
    viewport: { width: 1600, height: 1200 },
    colorScheme: 'light',
    deviceScaleFactor: 1,
  },
});
