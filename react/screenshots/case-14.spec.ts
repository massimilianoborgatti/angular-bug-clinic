import { test, expect } from '@playwright/test';
for (const variant of ['Broken', 'Fixed'])
  test('14 ' + variant + ' portfolio screenshot', async ({ page }) => {
    await page.goto('./cases/14-code-review-sample/');
    const fixed = page.getByRole('tab', { name: 'Fixed', exact: true });
    await expect(async () => {
      await fixed.click();
      await expect(fixed).toHaveAttribute('aria-selected', 'true', { timeout: 1000 });
    }).toPass({ timeout: 10000 });
    if (variant === 'Broken') await page.getByRole('tab', { name: 'Broken', exact: true }).click();
    await expect(page.getByRole('tab', { name: variant, exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator('.site-header')).toBeInViewport({ ratio: 1 });
    await page.screenshot({
      path: '../docs/screenshots/14-' + variant.toLowerCase() + '.png',
      animations: 'disabled',
    });
  });
