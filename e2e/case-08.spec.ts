import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const variant of ['Broken', 'Fixed'] as const) {
  test('08 ' + variant + ': keyboard entry, containment and return', async ({ page }) => {
    await page.goto('./#/cases/08-keyboard-dialog');
    await page.getByRole('tab', { name: variant, exact: true }).click();
    const trigger = page.getByRole('button', { name: 'Edit contact', exact: true });
    // Reach the trigger using Tab rather than a pointer.
    await page.getByRole('tab', { name: variant, exact: true }).focus();
    for (
      let i = 0;
      i < 8 && !(await trigger.evaluate((element) => element === document.activeElement));
      i++
    )
      await page.keyboard.press('Tab');
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Enter');
    const panel = page.getByTestId('contact-dialog');
    await expect(panel).toBeVisible();
    test.fail(variant === 'Broken', 'Focus remains behind an unnamed div overlay.');
    await expect(page.getByRole('dialog', { name: 'Edit contact', exact: true })).toBeVisible();
    await expect(page.getByLabel('Name', { exact: true })).toBeFocused();
    for (const key of ['Tab', 'Shift+Tab'])
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press(key);
        expect(await panel.evaluate((element) => element.contains(document.activeElement))).toBe(
          true,
        );
      }
    await page.keyboard.press('Escape');
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
  test(
    '08 ' + variant + ': open dialog has no serious or critical axe violations',
    async ({ page }) => {
      await page.goto('./#/cases/08-keyboard-dialog');
      await page.getByRole('tab', { name: variant, exact: true }).click();
      await page.getByRole('button', { name: 'Edit contact', exact: true }).click();
      await expect(page.getByTestId('contact-dialog')).toBeVisible();
      const results = await new AxeBuilder({ page })
        .include('[data-testid="contact-dialog"]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const violations = results.violations.filter(
        (item) => item.impact === 'serious' || item.impact === 'critical',
      );
      test.fail(
        variant === 'Broken',
        'The div overlay declares modality without dialog semantics.',
      );
      expect(violations.map((item) => item.id)).toEqual([]);
    },
  );
}
test('08 Broken exposes background focus, absent close semantics and lost return focus', async ({
  page,
}) => {
  await page.goto('./#/cases/08-keyboard-dialog');
  const trigger = page.getByRole('button', { name: 'Edit contact', exact: true });
  await trigger.click();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Contact list help', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('contact-dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(trigger).not.toBeFocused();
});
test('08 Broken axe symptom is the prohibited modal attribute on a generic div', async ({
  page,
}) => {
  await page.goto('./#/cases/08-keyboard-dialog');
  await page.getByRole('button', { name: 'Edit contact', exact: true }).click();
  const result = await new AxeBuilder({ page }).include('[data-testid="contact-dialog"]').analyze();
  expect(result.violations.map((item) => item.id)).toContain('aria-allowed-attr');
});
test('08 Fixed retains focus in a small viewport and closes from its named button', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#/cases/08-keyboard-dialog');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  const trigger = page.getByRole('button', { name: 'Edit contact', exact: true });
  await trigger.click();
  await expect(page.getByLabel('Name', { exact: true })).toBeInViewport();
  await page.getByRole('button', { name: 'Close edit contact', exact: true }).click();
  await expect(trigger).toBeFocused();
});
