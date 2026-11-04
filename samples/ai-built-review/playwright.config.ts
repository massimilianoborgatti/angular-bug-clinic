import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4600',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:4600',
    reuseExistingServer: false,
    env: { NEXT_TELEMETRY_DISABLED: '1' },
  },
});
