import { test, expect } from '@playwright/test';
import { shopUrl, product, add } from './scenario.mjs';
for (const variant of ['broken', 'fixed']) {
  test(variant + ': header count, total and spinner update without reloading', async ({ page }) => {
    await page.goto(shopUrl(variant));
    await expect(page.locator('.clinic-cart-count')).toHaveText('0');
    await add(page, 'Blue Mug');
    test.fail(variant === 'broken', 'The child theme returns a selector absent from the header.');
    await expect(page.locator('.clinic-cart-count')).toHaveText('1', { timeout: 5_000 });
    await expect(page.locator('.clinic-cart-total')).toHaveText('$12.00');
    await expect(product(page, 'Blue Mug').locator('.ajax_add_to_cart')).not.toHaveClass(
      /clinic-pending/,
    );
    await add(page, 'Notebook');
    await expect(page.locator('.clinic-cart-count')).toHaveText('2');
    await expect(page.locator('.clinic-cart-total')).toHaveText('$20.00');
  });
  test(variant + ': the header fragment selector matches the printed element', async ({ page }) => {
    await page.goto(shopUrl(variant));
    const result = await add(page, 'Blue Mug');
    const keys = Object.keys(result.fragments).filter((key) => key.includes('header-cart'));
    expect(keys).toHaveLength(1);
    test.fail(variant === 'broken', 'The old header selector matches no element.');
    expect(await page.locator(keys[0]).count()).toBe(1);
    expect(keys[0]).toBe('a.clinic-header-cart');
  });
}
test('broken: addition succeeds but the badge and spinner stay stale until reload', async ({
  page,
}) => {
  await page.goto(shopUrl('broken'));
  await add(page, 'Blue Mug');
  await expect(page.locator('.clinic-cart-count')).toHaveText('0');
  await expect(product(page, 'Blue Mug').locator('.ajax_add_to_cart')).toHaveClass(
    /clinic-pending/,
  );
  await page.reload();
  await expect(page.locator('.clinic-cart-count')).toHaveText('1');
  await expect(page.locator('.clinic-cart-total')).toHaveText('$12.00');
});
test('fixed: a failed AJAX request releases the spinner', async ({ page }) => {
  await page.goto(shopUrl('fixed'));
  await page.route('**/*wc-ajax=add_to_cart*', (route) => route.abort());
  const button = product(page, 'Blue Mug').locator('.ajax_add_to_cart');
  await button.click();
  await expect(button).not.toHaveClass(/clinic-pending/, { timeout: 5_000 });
  await expect(button).not.toHaveAttribute('aria-busy');
  await expect(page.locator('.clinic-cart-count')).toHaveText('0');
});
