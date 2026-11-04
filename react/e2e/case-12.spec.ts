import { test, expect } from '@playwright/test';
const base = 'cases/12-core-web-vitals/';
for (const fixed of [false, true]) {
  const variant = fixed ? 'fixed' : 'broken';
  test('12 ' + variant + ': artwork space is reserved before image delivery', async ({ page }) => {
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route('**/case-12/notebook*', async (route) => {
      await held;
      await route.continue();
    });
    try {
      await page.goto('./' + base + variant + '/', { waitUntil: 'domcontentloaded' });
      const art = page.getByTestId('hero-art');
      await expect(art).toBeVisible();
      const bounds = await art.boundingBox();
      test.fail(!fixed, 'The background has no intrinsic dimensions or reserved aspect ratio.');
      expect(bounds!.height / bounds!.width).toBeCloseTo(0.625, 1);
    } finally {
      release();
    }
  });
  test(
    '12 ' + variant + ': billing updates on the next frame in less than 100 ms',
    async ({ page }) => {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.goto('./' + base + variant + '/');
      await page.getByTestId('hero-art').scrollIntoViewIfNeeded();
      if (!fixed)
        await expect
          .poll(
            () =>
              page
                .getByTestId('hero-art')
                .evaluate((element) => getComputedStyle(element).backgroundImage),
            { timeout: 15000 },
          )
          .toContain('notebook-large.png');
      await expect(page.getByTestId('plan-price')).toHaveText('$8');
      // The notice proves hydration has completed before the timed interaction.
      await expect(page.getByTestId('notes-banner')).toBeVisible({ timeout: 15000 });
      await page.getByTestId('billing-toggle').click();
      await expect(page.getByTestId('plan-price')).toHaveText('$6');
      await expect(page.getByTestId('toggle-response')).not.toHaveAttribute('data-ms', '');
      const elapsed = Number(await page.getByTestId('toggle-response').getAttribute('data-ms'));
      test.fail(!fixed, 'Repeated formatter construction blocks the interaction.');
      expect(elapsed).toBeLessThan(100);
    },
  );
}
test('12 Broken visibly expands its image after loading and inserts the notice into document flow', async ({
  page,
}) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto('./' + base + 'broken/');
  await page.getByTestId('hero-art').scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        page
          .getByTestId('hero-art')
          .evaluate((element) => getComputedStyle(element).backgroundImage),
      { timeout: 15000 },
    )
    .toContain('notebook-large.png');
  await expect(page.getByTestId('hero-art')).toHaveAttribute('data-loaded', 'true', {
    timeout: 15000,
  });
  for (const name of ['LCP', 'CLS', 'TBT'])
    await expect(page.getByTestId('lab-' + name)).toHaveAttribute('data-status', 'fail');
  await expect(page.getByTestId('notes-banner')).toBeVisible({ timeout: 15000 });
  expect(
    await page
      .getByTestId('notes-banner')
      .evaluate((element) => getComputedStyle(element).position),
  ).toBe('static');
  await page.getByTestId('billing-toggle').click();
  await expect(page.getByTestId('plan-price')).toHaveText('$6');
  await expect(page.getByTestId('toggle-response')).not.toHaveAttribute('data-ms', '');
  expect(
    Number(await page.getByTestId('toggle-response').getAttribute('data-ms')),
  ).toBeGreaterThanOrEqual(100);
});
test('12 Fixed uses priority WebP, an overlay notice, real browser metrics and a narrow layout', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./' + base + 'fixed/');
  await expect(page).toHaveTitle('The landing page that felt slow | Bug Clinic');
  for (const name of ['LCP', 'CLS', 'TBT'])
    await expect(page.getByTestId('lab-' + name)).toHaveAttribute('data-status', 'pass');
  await expect(page.getByTestId('hero-art')).toHaveAttribute('src', /notebook\.webp$/);
  await expect(page.getByTestId('hero-art')).toHaveAttribute('width', '1200');
  await expect(page.getByTestId('hero-art')).toHaveAttribute('sizes', /100vw/);
  await expect(page.getByTestId('notes-banner')).toBeVisible({ timeout: 15000 });
  expect(
    await page
      .getByTestId('notes-banner')
      .evaluate((element) => getComputedStyle(element).position),
  ).toBe('fixed');
  await page.getByRole('button', { name: 'Dismiss notice' }).click();
  await page.getByTestId('billing-toggle').click();
  await expect(page.getByTestId('vital-LCP')).not.toHaveText('Waiting…');
  await expect(page.getByTestId('vital-INP')).not.toHaveText('Waiting…');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('tab', { name: 'Broken', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Broken', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});
