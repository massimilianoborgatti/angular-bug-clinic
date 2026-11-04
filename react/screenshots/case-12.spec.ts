import { test, expect } from '@playwright/test';
for (const variant of ['broken', 'fixed'])
  test('12 ' + variant + ' portfolio screenshot', async ({ page }) => {
    await page.goto('./cases/12-core-web-vitals/' + variant + '/');
    await expect(page.getByTestId('notes-banner')).toBeVisible();
    if (variant === 'broken')
      await expect(page.getByTestId('hero-art')).toHaveAttribute('data-loaded', 'true');
    await page.getByTestId('billing-toggle').click();
    await expect(page.getByTestId('toggle-response')).not.toHaveAttribute('data-ms', '');
    await page.getByRole('button', { name: 'Dismiss notice' }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator('.site-header')).toBeInViewport({ ratio: 1 });
    for (const name of ['LCP', 'CLS', 'TBT']) {
      await expect(page.getByTestId('lab-' + name)).toHaveAttribute(
        'data-status',
        variant === 'broken' ? 'fail' : 'pass',
      );
      await expect(page.getByTestId('lab-' + name)).toBeInViewport({ ratio: 1 });
    }
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await page.screenshot({
      path: '../docs/screenshots/12-' + variant + '.png',
      animations: 'disabled',
    });
  });
