import { test, expect } from '@playwright/test';
for (const variant of ['broken', 'fixed'])
  test('11 ' + variant + ' portfolio screenshot', async ({ page }) => {
    await page.goto('./cases/11-spa-analytics/?mode=' + variant);
    await page.getByRole('button', { name: 'Accept', exact: true }).click();
    await page.getByRole('link', { name: 'Browse plants →', exact: true }).click();
    await page.getByRole('link', { name: 'Monstera →', exact: true }).click();
    await page.getByRole('link', { name: 'Choose clay pot', exact: true }).click();
    await expect(page.getByTestId('page-view-count')).toHaveText(variant === 'fixed' ? '4' : '2');
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await page.screenshot({
      path: '../docs/screenshots/11-' + variant + '.png',
      animations: 'disabled',
    });
  });
