import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('09 has its own page metadata and is reachable from React navigation', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('The effect that never stopped | Bug Clinic');
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Case 09', exact: true })
    .click();
  await expect(page).toHaveURL(/\/cases\/09-form-errors\/$/);
  await expect(page).toHaveTitle('The form errors nobody heard | Bug Clinic');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Compare inaccessible form errors with explicit labels, linked error messages and focused recovery.',
  );
  await page.reload();
  await expect(page).toHaveTitle('The form errors nobody heard | Bug Clinic');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await expect(page).toHaveTitle('The form errors nobody heard | Bug Clinic');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation.getByRole('link', { name: 'Case 09', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await navigation.getByRole('link', { name: 'Case 06', exact: true }).click();
  await expect(page).toHaveTitle('The effect that never stopped | Bug Clinic');
});
test('React navigation connects cases 06, 07 and 09 on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('./');
  for (const [id, path, title] of [
    ['07', 'cases/07-node-refresh-race/', 'Logged out at random | Bug Clinic'],
    ['09', 'cases/09-form-errors/', 'The form errors nobody heard | Bug Clinic'],
    ['06', '', 'The effect that never stopped | Bug Clinic'],
  ]) {
    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    for (const caseId of ['06', '07', '09']) {
      await expect(
        navigation.getByRole('link', { name: 'Case ' + caseId, exact: true }),
      ).toBeVisible();
    }
    await navigation.getByRole('link', { name: 'Case ' + id, exact: true }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4400/angular-bug-clinic/react/' + path);
    await expect(page).toHaveTitle(title);
    await expect(
      page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Case ' + id, exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

for (const variant of ['Broken', 'Fixed'] as const) {
  test('09 ' + variant + ': keyboard-only validation and recovery', async ({ page }) => {
    await page.goto('./cases/09-form-errors/');
    await page.getByRole('tab', { name: variant, exact: true }).click();
    await page.getByTestId('signup-name').focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
    await expect(page.getByTestId('signup-submit')).toBeFocused();
    await page.keyboard.press('Enter');
    test.fail(
      variant === 'Broken',
      'A div submit control has no keyboard activation or error destination.',
    );
    const summary = page.getByRole('region', { name: 'There are 3 errors' });
    await expect(summary).toBeFocused();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Name (required)', { exact: true })).toBeFocused();
    await page.keyboard.type('Demo contact');
    await page.keyboard.press('Tab');
    await page.keyboard.type('contact@example.test');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('You are subscribed to the demo newsletter.');
  });
  test(
    '09 ' + variant + ': invalid form has no serious or critical axe violations',
    async ({ page }) => {
      await page.goto('./cases/09-form-errors/');
      await page.getByRole('tab', { name: variant, exact: true }).click();
      await page.getByTestId('signup-submit').click();
      await expect(page.getByText('Enter your name.', { exact: false }).last()).toBeVisible();
      const result = await new AxeBuilder({ page })
        .include('.signup-demo')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      test.fail(variant === 'Broken', 'The checkbox has no accessible label.');
      expect(
        result.violations
          .filter((item) => item.impact === 'serious' || item.impact === 'critical')
          .map((item) => item.id),
      ).toEqual([]);
    },
  );
}
test('09 Broken exposes visible errors without field relationships or a live success region', async ({
  page,
}) => {
  await page.goto('./cases/09-form-errors/');
  await page.getByTestId('signup-submit').click();
  await expect(page.getByTestId('signup-submit')).toBeFocused();
  await expect(page.getByTestId('signup-name')).not.toHaveAttribute('aria-describedby');
  await expect(page.getByRole('button', { name: 'Subscribe' })).toHaveCount(0);
  const result = await new AxeBuilder({ page }).include('.signup-demo').analyze();
  expect(result.violations.map((item) => item.id)).toContain('label');
});
test('09 Fixed error summary and field descriptions remain usable at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('./cases/09-form-errors/');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await page.getByRole('button', { name: 'Subscribe' }).click();
  for (const id of ['name', 'email', 'terms']) {
    await expect(page.getByTestId('signup-' + id)).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByTestId('signup-' + id)).toHaveAccessibleDescription(/Enter|Accept/);
  }
  await page.getByRole('link', { name: 'Enter a valid email address.' }).click();
  await expect(page.getByLabel('Email (required)', { exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
