import { test, expect, type Page } from '@playwright/test';
const base = 'cases/11-spa-analytics/';
export async function commands(page: Page) {
  return page.evaluate(() => window.dataLayer);
}
export async function journey(page: Page) {
  await page.getByRole('link', { name: 'Browse plants →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Plants', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Monstera →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Monstera · green', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Choose clay pot', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Monstera · clay', exact: true })).toBeVisible();
}
for (const variant of ['broken', 'fixed'] as const) {
  test(
    '11 ' + variant + ': four consented page views for route and query changes',
    async ({ page }) => {
      const failedAssets: string[] = [];
      page.on('response', (response) => {
        if (response.status() >= 400) failedAssets.push(response.url());
      });
      await page.goto('./' + base + '?mode=' + variant);
      await expect(page.getByRole('status')).toHaveText('Consent: pending');
      // A document marker proves that all three clicks use client navigation.
      await page.evaluate(() => {
        document.documentElement.dataset.journey = 'persistent';
      });
      await page.getByRole('button', { name: 'Accept', exact: true }).click();
      await journey(page);
      expect(await page.locator('html').getAttribute('data-journey')).toBe('persistent');
      expect(failedAssets).toEqual([]);
      test.fail(
        variant === 'broken',
        'Config duplicates the initial view; the mount-only effect misses navigation.',
      );
      await expect(page.getByTestId('page-view-count')).toHaveText('4');
      const views = (await commands(page)).filter(
        ([cmd, name]) => cmd === 'event' && name === 'page_view',
      );
      expect(
        views.map(
          (entry) =>
            new URL(entry[2].page_location as string).pathname +
            new URL(entry[2].page_location as string).search,
        ),
      ).toEqual([
        '/angular-bug-clinic/react/' + base + '?mode=' + variant,
        '/angular-bug-clinic/react/' + base + 'plants/?mode=' + variant,
        '/angular-bug-clinic/react/' + base + 'plants/detail/?mode=' + variant + '&color=green',
        '/angular-bug-clinic/react/' + base + 'plants/detail/?mode=' + variant + '&color=clay',
      ]);
      expect(views.map((entry) => entry[2].page_title)).toEqual([
        'Home | Demo Plant Shop',
        'Plants | Demo Plant Shop',
        'Monstera (green) | Demo Plant Shop',
        'Monstera (clay) | Demo Plant Shop',
      ]);
    },
  );
  test('11 ' + variant + ': rejection leaves only ordered consent signals', async ({ page }) => {
    await page.goto('./' + base + '?mode=' + variant);
    await page.getByRole('button', { name: 'Reject', exact: true }).click();
    await journey(page);
    await page.getByRole('button', { name: 'Add to wishlist', exact: true }).click();
    test.fail(
      variant === 'broken',
      'Events precede the consent choice and no default denied is sent.',
    );
    const entries = await commands(page);
    expect(entries.map(([cmd, name]) => [cmd, name])).toEqual([
      ['consent', 'default'],
      ['consent', 'update'],
    ]);
    expect(Object.values(entries[0][2])).toEqual(['denied', 'denied', 'denied', 'denied']);
    await expect(page.getByTestId('page-view-count')).toHaveText('0');
  });
}
test('11 Broken shows two views before consent and keeps both on the initial page after navigation', async ({
  page,
}) => {
  await page.goto('./' + base);
  await expect(page.getByTestId('page-view-count')).toHaveText('2');
  await expect(page.getByRole('status')).toHaveText('Consent: pending');
  const initial = (await commands(page)).filter(([cmd]) => cmd === 'event');
  expect(initial.map((entry) => entry[1])).toEqual(['page_view', 'page_view']);
  expect(initial[0][2].page_location).toBe(initial[1][2].page_location);
  await journey(page);
  expect((await commands(page)).filter(([cmd]) => cmd === 'event')).toEqual(initial);
});
test('11 Fixed gates wishlist events, supports Back, resets variants and sends no tracking requests', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).hostname !== '127.0.0.1') external.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./' + base + '?mode=fixed');
  await expect(page).toHaveTitle('Page views that lied | Bug Clinic');
  await expect(page.getByTestId('page-view-count')).toHaveText('0');
  await journey(page);
  await page.getByRole('button', { name: 'Add to wishlist', exact: true }).click();
  expect((await commands(page)).map((entry) => entry[0])).toEqual(['consent']);
  await page.getByRole('button', { name: 'Accept', exact: true }).click();
  await expect(page.getByTestId('page-view-count')).toHaveText('1');
  await page.getByRole('button', { name: 'Add to wishlist', exact: true }).click();
  expect((await commands(page)).at(-1)).toEqual([
    'event',
    'add_to_wishlist',
    {
      currency: 'USD',
      value: 24,
      items: [
        {
          item_id: 'demo-monstera',
          item_name: 'Monstera',
          item_variant: 'clay',
          price: 24,
          quantity: 1,
        },
      ],
    },
  ]);
  const entries = await commands(page);
  expect(entries[0][0]).toBe('consent');
  expect(entries[0][1]).toBe('default');
  expect(entries.findIndex(([cmd, name]) => cmd === 'consent' && name === 'update')).toBeLessThan(
    entries.findIndex(([cmd]) => cmd === 'event'),
  );
  expect(entries.find(([cmd]) => cmd === 'config')?.[2]).toEqual({ send_page_view: false });
  await page.goBack();
  await expect(page.getByTestId('page-view-count')).toHaveText('2');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('tab', { name: 'Broken', exact: true }).click();
  await expect(page.getByTestId('page-view-count')).toHaveText('2');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await expect(page.getByTestId('page-view-count')).toHaveText('0');
  expect(external).toEqual([]);
});
test('11 implementation tabs retain keyboard focus after starting a fresh session', async ({
  page,
}) => {
  await page.goto('./' + base);
  await page.getByRole('tab', { name: 'Broken', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toBeFocused();
  await expect(page.getByTestId('page-view-count')).toHaveText('0');
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: 'Broken', exact: true })).toBeFocused();
  await expect(page.getByTestId('page-view-count')).toHaveText('2');
});
