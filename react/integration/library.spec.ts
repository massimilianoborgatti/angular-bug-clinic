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
  await expect(page.locator('.case-card')).toHaveCount(12);
  await page.getByRole('link', { name: /CASE 06/ }).click();
  await expect(page).toHaveURL(/\/angular-bug-clinic\/react\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The effect that never stopped');
  // The first request starts in an effect, after the controls are hydrated.
  await expect(page.getByTestId('request-count')).not.toHaveText('0');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByTestId('order-status')).toHaveCount(4);
  await expect(page.getByTestId('request-count')).toHaveText('1');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The effect that never stopped');
  await page.getByRole('link', { name: 'Back to the case library', exact: false }).click();
  await expect(page.locator('.case-card')).toHaveCount(12);
  for (const slug of [
    '01-subscription-leak',
    '02-onpush-stale-view',
    '03-async-validator-race',
    '04-guard-redirect-loop',
    '05-ionic-back-button',
    '08-keyboard-dialog',
  ]) {
    await page.goto('./#/cases/' + slug);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toBeVisible();
  }
  await page.goto('./');
  await page.getByRole('link', { name: /CASE 07/ }).click();
  await expect(page).toHaveURL(/\/react\/cases\/07-node-refresh-race\/$/);
  await page.reload();
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await page.getByRole('button', { name: 'Log in to demo' }).click();
  await expect(page.getByRole('button', { name: 'Reload dashboard' })).toBeEnabled();
  await expect(page.getByRole('status')).toHaveText(/^Logged in$/);
  await page.goto('./');
  await page.getByRole('link', { name: /CASE 09/ }).click();
  await expect(page).toHaveURL(/\/react\/cases\/09-form-errors\/$/);
  await page.reload();
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Name (required)', exact: true })).toBeVisible();
  await page.goto('./#/cases/10-woocommerce-cart');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'The cart that only updated after a reload',
  );
  await page.goto('./');
  await page.getByRole('link', { name: /CASE 11/ }).click();
  await expect(page).toHaveURL(/\/react\/cases\/11-spa-analytics\/$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page views that lied');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await expect(page.getByTestId('page-view-count')).toHaveText('0');
  await page.goto('./');
  await page.getByRole('link', { name: /CASE 12/ }).click();
  await expect(page).toHaveURL(/\/react\/cases\/12-core-web-vitals\/$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'The landing page that felt slow',
  );
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await expect(page.getByTestId('hero-art')).toHaveAttribute('src', /notebook\.webp$/);
  expect(failedAssets).toEqual([]);
  expect(errors).toEqual([]);
});
