import { test, expect } from '@playwright/test';
import { shopUrl, product, add } from '../e2e/scenario.mjs';
for (const variant of ['broken', 'fixed'])
  test(variant + ': cart screenshot', async ({ page }) => {
    await page.goto(shopUrl(variant));
    await add(page, 'Blue Mug');
    await expect(page.locator('.clinic-cart-count')).toHaveText(variant === 'broken' ? '0' : '1');
    await expect(product(page, 'Blue Mug').locator('.ajax_add_to_cart')).toHaveClass(
      variant === 'broken' ? /clinic-pending/ : /added/,
    );
    await page.screenshot({
      path: '../../docs/screenshots/10-' + variant + '.png',
      animations: 'disabled',
    });
  });
