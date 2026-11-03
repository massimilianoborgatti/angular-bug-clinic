import { expect } from '@playwright/test';
export function shopUrl(variant) {
  return 'http://127.0.0.1:' + (variant === 'broken' ? 9410 : 9411) + '/shop/';
}
export function product(page, name) {
  return page
    .locator('li.product')
    .filter({ has: page.getByRole('heading', { name, exact: true }) });
}
export async function add(page, name) {
  const item = product(page, name);
  const response = page.waitForResponse(
    (r) => r.url().includes('wc-ajax=add_to_cart') && r.request().method() === 'POST',
  );
  await item.locator('.ajax_add_to_cart').click();
  const result = await response;
  expect(result.status()).toBe(200);
  const body = await result.json();
  expect(body.error).not.toBe(true);
  await expect(item.locator('.added_to_cart')).toBeVisible();
  return body;
}
