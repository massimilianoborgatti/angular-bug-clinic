import { test, expect } from '@playwright/test';
import { openCase, replayRace } from './scenario';
for (const variant of ['Broken', 'Fixed'] as const) {
  test(variant + ': request count stays at one after three seconds', async ({ page }) => {
    await openCase(page, variant);
    await page.clock.runFor(3000);
    // Only the intended invariant is an expected failure, not page setup.
    test.fail(
      variant === 'Broken',
      'Each response creates a new dependency and restarts the effect.',
    );
    await expect(page.getByTestId('request-count')).toHaveText('1', { timeout: 1000 });
  });
  test(
    variant + ': the newest filter wins after every earlier response finishes',
    async ({ page }) => {
      await openCase(page, variant);
      await replayRace(page);
      test.fail(variant === 'Broken', 'The obsolete Open response replaces the Shipped results.');
      await expect(page.getByTestId('order-status')).toHaveText(['Shipped', 'Shipped'], {
        timeout: 1000,
      });
    },
  );
}
test('Broken exposes both specific symptoms', async ({ page }) => {
  await openCase(page, 'Broken');
  await expect(page.getByTestId('request-count')).toHaveText('2');
  await replayRace(page);
  await expect(page.getByTestId('showing')).toHaveText('Showing: Open');
  await expect(page.getByTestId('order-status')).toHaveText(['Open', 'Open']);
  const count = Number(await page.getByTestId('request-count').textContent());
  await page.clock.runFor(900);
  expect(Number(await page.getByTestId('request-count').textContent())).toBeGreaterThan(count);
});
test('Fixed search, keyboard tabs and narrow layout work without page errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await openCase(page, 'Fixed');
  await page.getByLabel('Search orders').fill('notebook');
  await expect(page.getByRole('status')).toContainText('Loading');
  await page.clock.runFor(900);
  await expect(page.getByRole('list', { name: 'Orders', exact: true })).toContainText(
    'Notebook set',
  );
  await expect(page.getByTestId('order-status')).toHaveCount(1);
  await page.getByRole('tab', { name: 'Fixed', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Broken', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
