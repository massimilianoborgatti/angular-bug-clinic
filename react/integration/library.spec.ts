import { test, expect } from '@playwright/test';
test('the combined static site links both apps and preserves every Angular case URL', async ({
  page,
}) => {
  const errors: string[] = [];
  const failedAssets: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) failedAssets.push(response.url());
  });
  await page.goto('./');
  await expect(page.locator('.case-card')).toHaveCount(6);
  await page.getByRole('link', { name: /CASE 06/ }).click();
  await expect(page).toHaveURL(/\/angular-bug-clinic\/react\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The effect that never stopped');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await expect(page.getByTestId('order-status')).toHaveCount(4);
  await expect(page.getByTestId('request-count')).toHaveText('1');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The effect that never stopped');
  await page.getByRole('link', { name: 'Back to the case library', exact: false }).click();
  await expect(page.locator('.case-card')).toHaveCount(6);
  for (const slug of [
    '01-subscription-leak',
    '02-onpush-stale-view',
    '03-async-validator-race',
    '04-guard-redirect-loop',
    '05-ionic-back-button',
  ]) {
    await page.goto('./#/cases/' + slug);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toBeVisible();
  }
  expect(failedAssets).toEqual([]);
  expect(errors).toEqual([]);
});
