import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function open(page: Page, variant: string) {
  await page.goto('./cases/13-design-to-code/');
  // A visible tab alone can precede hydration in a static export.
  await expect(async () => {
    await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
    await expect(page.locator('.studio-fixed')).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 10000 });
  if (variant === 'Broken') await page.getByRole('tab', { name: 'Broken', exact: true }).click();
  await expect(page.locator('.studio')).toHaveClass(new RegExp('studio-' + variant.toLowerCase()));
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByTestId('studio-art')).toHaveJSProperty('complete', true);
}

async function separated(page: Page) {
  const heading = await page.getByTestId('studio-heading').boundingBox();
  const art = await page.getByTestId('studio-art').boundingBox();
  expect(heading).not.toBeNull();
  expect(art).not.toBeNull();
  return (
    heading!.x + heading!.width <= art!.x ||
    art!.x + art!.width <= heading!.x ||
    heading!.y + heading!.height <= art!.y ||
    art!.y + art!.height <= heading!.y
  );
}

for (const variant of ['Broken', 'Fixed']) {
  for (const width of [320, 375, 768, 1280]) {
    test('13 ' + variant + ': layout fits and separates text/art at ' + width, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, variant);
      const fits = await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      );
      const clear = await separated(page);
      test.fail(variant === 'Broken', 'Rigid columns overflow or put artwork behind the heading.');
      expect({ fits, clear }).toEqual({ fits: true, clear: true });
    });
  }
  test('13 ' + variant + ': FAQ opens and closes by keyboard', async ({ page }) => {
    await open(page, variant);
    const trigger = page.locator('.s-questions').getByText('What is included?', { exact: true });
    await trigger.locator('..').focus();
    await expect(trigger.locator('..')).toBeFocused();
    await page.keyboard.press('Enter');
    test.fail(variant === 'Broken', 'The div FAQ has pointer behavior but no keyboard activation.');
    await expect(
      page.getByText('A one-page design, a responsive build and a focused accessibility pass.', {
        exact: true,
      }),
    ).toBeVisible();
    await page.keyboard.press('Space');
    await expect(
      page.getByText('A one-page design, a responsive build and a focused accessibility pass.', {
        exact: true,
      }),
    ).not.toBeVisible();
  });
  test('13 ' + variant + ': enquiry works by keyboard without sending data', async ({ page }) => {
    await open(page, variant);
    const action = page.locator('.s-hero .s-action');
    await action.focus();
    await expect(action).toBeFocused();
    await page.keyboard.press('Enter');
    test.fail(variant === 'Broken', 'A div does not implement native button keyboard activation.');
    await expect(page.locator('.s-feedback')).toHaveText(
      'Demo enquiry selected. No message is sent.',
    );
  });
  test('13 ' + variant + ': icon link has a name and a 24px target', async ({ page }) => {
    await open(page, variant);
    const icon = page.getByTestId('studio-top-link');
    const box = await icon.boundingBox();
    expect(box).not.toBeNull();
    test.fail(variant === 'Broken', 'The decorative icon has no link name and a 16px target.');
    await expect(icon).toHaveAccessibleName('Back to top');
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
  });
  test('13 ' + variant + ': no serious or critical axe findings', async ({ page }) => {
    await open(page, variant);
    const result = await new AxeBuilder({ page })
      .include('.studio')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    test.fail(variant === 'Broken', 'The icon is unnamed and the hero text lacks contrast.');
    expect(
      result.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => v.id),
    ).toEqual([]);
  });
  for (const width of [1440, 375]) {
    test('13 ' + variant + ': matches original mockup at ' + width, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await open(page, variant);
      // The handoff contains only the studio, without the surrounding clinic controls.
      await page.addStyleTag({
        content: '.design-clinic > .site-header, .design-intro { display: none; }',
      });
      test.fail(
        variant === 'Broken',
        'Rigid positioning differs from the independent design reference.',
      );
      await expect(page).toHaveScreenshot('13-reference-' + width + '.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
        threshold: 0.25,
        animations: 'disabled',
      });
    });
  }
}

test('13 Broken has reproducible pointer-only controls, overflow and tablet overlap', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await open(page, 'Broken');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(true);
  await page.locator('.s-question-trigger').first().click();
  await expect(
    page.getByText('A one-page design, a responsive build and a focused accessibility pass.', {
      exact: true,
    }),
  ).toBeVisible();
  await page.locator('.s-hero .s-action').click();
  await expect(page.locator('.s-feedback')).toHaveText(
    'Demo enquiry selected. No message is sent.',
  );
  await expect(page.getByTestId('studio-top-link')).toHaveAccessibleName('');
  const icon = await page.getByTestId('studio-top-link').boundingBox();
  expect(icon!.width).toBe(16);
  const result = await new AxeBuilder({ page }).include('.studio').analyze();
  expect(result.violations.map((v) => v.id)).toEqual(
    expect.arrayContaining(['link-name', 'color-contrast']),
  );
  await page.setViewportSize({ width: 768, height: 900 });
  expect(await separated(page)).toBe(false);
});

test('13 Fixed keeps every interactive target usable at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await open(page, 'Fixed');
  for (const target of await page.locator('.studio').locator('a, button, summary').all()) {
    const box = await target.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
  }
  await expect(page).toHaveTitle('The design that broke on phones | Bug Clinic');
  await expect(page.getByRole('link', { name: 'Open the design reference' })).toHaveAttribute(
    'href',
    '/angular-bug-clinic/react/case-13/reference.html',
  );
});
