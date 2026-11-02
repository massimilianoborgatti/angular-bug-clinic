import { expect, type Page } from '@playwright/test';
export async function expireAndReload(page: Page, variant: 'Broken' | 'Fixed') {
  await page.goto('./cases/07-node-refresh-race/');
  await page.getByRole('tab', { name: variant, exact: true }).click();
  const login = page.waitForResponse(
    (response) => response.url().endsWith('/login') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Log in to demo' }).click();
  const response = await login;
  expect(response.fromServiceWorker()).toBe(true);
  const { expiresAt } = await response.json();
  await expect(page.getByRole('button', { name: 'Reload dashboard' })).toBeEnabled();
  await expect(page.locator('.task-lists li')).toHaveCount(3);
  // Wait for the actual token deadline, not a guessed response ordering.
  await expect
    .poll(() => page.evaluate(() => Date.now()), { timeout: 7_500, intervals: [100, 250, 500] })
    .toBeGreaterThan(expiresAt);
  await page.getByRole('button', { name: 'Reload dashboard' }).click();
  await expect(page.getByRole('button', { name: 'Log in to demo' })).toBeEnabled();
}
