import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure' },
  webServer: ['broken', 'fixed'].map((variant, index) => ({
    command: 'node scripts/run.mjs ' + variant + ' ' + (9410 + index),
    url: 'http://127.0.0.1:' + (9410 + index) + '/wp-includes/css/dashicons.min.css',
    timeout: 600_000,
    reuseExistingServer: !process.env.CI,
  })),
});
