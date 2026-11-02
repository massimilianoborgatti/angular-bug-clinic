import { test, expect } from '@playwright/test';
for (const variant of ['Broken', 'Fixed'] as const)
  test('09 ' + variant + ' portfolio screenshot', async ({ page }) => {
    await page.goto('./cases/09-form-errors/');
    await page.getByRole('tab', { name: variant, exact: true }).click();
    await page.getByTestId('signup-submit').click();
    if (variant === 'Fixed')
      await expect(page.getByRole('region', { name: 'There are 3 errors' })).toBeFocused();
    else await expect(page.getByText('Enter your name.', { exact: true })).toBeVisible();
    await page.screenshot({
      path: '../docs/screenshots/09-' + variant.toLowerCase() + '.png',
      animations: 'disabled',
    });
  });
