import { test, expect } from '@playwright/test';
import { expireAndReload } from '../e2e/refresh-scenario';
for (const variant of ['Broken', 'Fixed'] as const)
  test('07 ' + variant + ' portfolio screenshot', async ({ page }) => {
    await expireAndReload(page, variant);
    await expect(page.getByRole('status')).toHaveText(
      variant === 'Fixed' ? 'Logged in' : 'Logged out — log in again',
    );
    await page.screenshot({
      path: '../docs/screenshots/07-' + variant.toLowerCase() + '.png',
      animations: 'disabled',
    });
  });
