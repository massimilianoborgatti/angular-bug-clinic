import { test, expect } from '@playwright/test';
import { expireAndReload } from './refresh-scenario';
for (const variant of ['Broken', 'Fixed'] as const) {
  test(
    '07 ' + variant + ': an expired dashboard shares one refresh and stays logged in',
    async ({ page }) => {
      await expireAndReload(page, variant);
      test.fail(
        variant === 'Broken',
        'Three refreshes reuse the old token and revoke the session.',
      );
      await expect(page.getByRole('status')).toHaveText('Logged in');
      await expect(page.getByTestId('refresh-count')).toHaveText('1');
      await expect(page.locator('.task-lists li')).toHaveCount(3);
      await expect(page.getByText('refresh shared by 3 requests')).toBeVisible();
    },
  );
}
test('07 Broken specifically shows refresh reuse, revocation and recovery by login', async ({
  page,
}) => {
  await expireAndReload(page, 'Broken');
  await expect(page.getByRole('status')).toContainText('Logged out');
  await expect(page.getByTestId('refresh-count')).toHaveText('3');
  await expect(page.getByText('refresh reused → session revoked')).toHaveCount(2);
  await expect(page.locator('.task-lists li')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Reload dashboard' })).toBeDisabled();
  await page.getByRole('button', { name: 'Log in to demo' }).click();
  await expect(page.getByRole('button', { name: 'Reload dashboard' })).toBeEnabled();
  await expect(page.getByRole('status')).toHaveText('Logged in');
});
test('07 Fixed works on a narrow screen with keyboard controls and no page errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/07-node-refresh-race/');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  const login = page.getByRole('button', { name: 'Log in to demo' });
  await login.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.task-lists li')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Reload dashboard' })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
