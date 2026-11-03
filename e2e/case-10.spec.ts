import { test, expect } from '@playwright/test';
test('10 explains both outcomes and links separate Playground configurations', async ({ page }) => {
  await page.goto('./#/cases/10-woocommerce-cart');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'The cart that only updated after a reload',
  );
  for (const variant of ['Broken', 'Fixed']) {
    const link = page.getByRole('link', {
      name: 'Open ' + variant + ' in WordPress Playground',
      exact: true,
    });
    const url = new URL((await link.getAttribute('href'))!);
    expect(url.origin).toBe('https://playground.wordpress.net');
    expect(url.searchParams.get('blueprint-url')).toBe(
      'https://massimilianoborgatti.github.io/angular-bug-clinic/wp/case-10/blueprint-' +
        variant.toLowerCase() +
        '.json',
    );
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
