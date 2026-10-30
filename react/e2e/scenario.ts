import { expect, type Page } from '@playwright/test';
export async function openCase(page: Page, variant: 'Broken' | 'Fixed') {
  const now = new Date('2026-01-01T12:00:00Z');
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.addInitScript(() => {
    Math.random = () => 0.999;
  });
  await page.goto('./');
  await expect(page.getByTestId('request-count')).toHaveText('1');
  await page.getByRole('tab', { name: variant, exact: true }).click();
  await expect(page.getByRole('tab', { name: variant, exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.clock.runFor(900);
  await expect(page.getByTestId('order-status')).toHaveCount(4);
}
export async function replayRace(page: Page) {
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('Open');
  await page.evaluate(() => {
    Math.random = () => 0;
  });
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('Shipped');
  await page.evaluate(() => {
    Math.random = () => 0.999;
  });
  await page.clock.runFor(100);
  await expect(page.getByTestId('order-status')).toHaveText(['Shipped', 'Shipped']);
  await page.clock.runFor(800);
  await expect(page.getByRole('combobox', { name: 'Status', exact: true })).toHaveValue('Shipped');
}
