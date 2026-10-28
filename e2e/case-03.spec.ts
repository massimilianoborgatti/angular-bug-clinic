import { expect, test } from '@playwright/test';

for (const mode of ['Broken', 'Fixed'] as const) {
  test(`${mode}: current username owns the validation result`, async ({ page }) => {
    test.fail(mode === 'Broken', 'The older nested request overwrites the current result.');
    await page.goto('./#/cases/03-async-validator-race');
    await page.getByRole('tab', { name: mode, exact: true }).click();
    await page.getByRole('button', { name: 'Reproduce race', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Reproduce race', exact: true })).toBeEnabled();
    await expect(page.getByTestId('current-username')).toHaveText('freshname');
    await expect(page.getByTestId('validation-status')).toHaveText('Username available');
    await expect(page.getByTestId('checked-username')).toHaveText('freshname');
  });
}

test('Broken visibly applies the old response to the new value', async ({ page }) => {
  await page.goto('./#/cases/03-async-validator-race');
  await page.getByRole('button', { name: 'Reproduce race', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reproduce race', exact: true })).toBeEnabled();
  await expect(page.getByTestId('current-username')).toHaveText('freshname');
  await expect(page.getByTestId('checked-username')).toHaveText('taken');
  await expect(page.getByTestId('validation-status')).toHaveText('Username unavailable');
});
