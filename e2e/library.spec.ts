import { test, expect } from '@playwright/test';
test('every case is reachable from the library, including a direct hash reload', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Find the bug.');
  const cards = page.locator('.case-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.last()).toHaveAttribute('href', 'react/');
  for (let i = 0; i < 5; i++) {
    const href = await cards.nth(i).getAttribute('href');
    await page.goto('./' + href?.replace(/^\//, ''));
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    await page.getByRole('link', { name: 'Back to the case library', exact: false }).click();
    await expect(cards).toHaveCount(6);
  }
});
test('no page errors and a usable layout at a narrow viewport', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('.case-card').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});
