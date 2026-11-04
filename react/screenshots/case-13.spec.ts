import { test, expect } from '@playwright/test';
for (const variant of ['Broken', 'Fixed']) {
  test('13 ' + variant + ' portfolio screenshot', async ({ page }) => {
    await page.goto('./cases/13-design-to-code/');
    await expect(async () => {
      await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
      await expect(page.locator('.studio-fixed')).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 10000 });
    if (variant === 'Broken') await page.getByRole('tab', { name: 'Broken', exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByTestId('studio-art')).toHaveJSProperty('complete', true);
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator('.site-header')).toBeInViewport({ ratio: 1 });
    await page.screenshot({
      path: '../docs/screenshots/13-' + variant.toLowerCase() + '.png',
      animations: 'disabled',
    });
  });
}
