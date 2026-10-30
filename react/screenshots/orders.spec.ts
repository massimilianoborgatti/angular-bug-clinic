import { test, expect } from '@playwright/test';
import { openCase, replayRace } from '../e2e/scenario';
for (const variant of ['Broken', 'Fixed'] as const) {
  test(variant + ' portfolio screenshot', async ({ page }) => {
    await openCase(page, variant);
    await replayRace(page);
    await expect(page.getByTestId('showing')).toHaveText(
      'Showing: ' + (variant === 'Broken' ? 'Open' : 'Shipped'),
    );
    await page.screenshot({
      path: '../docs/screenshots/06-' + variant.toLowerCase() + '.png',
      animations: 'disabled',
    });
  });
}
