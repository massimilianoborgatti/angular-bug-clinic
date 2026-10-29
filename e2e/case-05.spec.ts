import { expect, test } from '@playwright/test';

for (const variant of ['Broken', 'Fixed'] as const) {
  test(
    'case 05 ' + variant + ': hardware back is offered to the real Ionic modal first',
    async ({ page }) => {
      await page.goto('./#/cases/05-ionic-back-button');
      await page.getByRole('tab', { name: variant, exact: true }).click();
      await page.getByRole('button', { name: 'Open task notes', exact: true }).click();
      const modal = page.locator('ion-modal');
      await expect(
        modal.getByRole('heading', { name: 'Prepare the weekly checklist' }),
      ).toBeVisible();
      await modal.getByRole('button', { name: 'Simulate hardware back', exact: true }).click();

      if (variant === 'Broken') {
        await expect(
          modal.getByText('The page moved, but this modal is still open.', { exact: true }),
        ).toBeVisible();
        await expect(modal.getByTestId('underlying-page')).toHaveText('Task list');
        await modal.getByRole('button', { name: 'Close notes', exact: true }).click();
      } else {
        await expect(
          modal.getByRole('heading', { name: 'Prepare the weekly checklist' }),
        ).not.toBeVisible();
        await expect(page.getByTestId('page-name')).toHaveText('Task details');
        await expect(page.getByTestId('navigation-count')).toHaveText('0');
        await page.getByRole('button', { name: 'Simulate hardware back', exact: true }).click();
        await expect(page.getByTestId('page-name')).toHaveText('Task list');
      }
    },
  );
}

test('case 05: browser Back releases an open modal and the case can be revisited', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  for (const variant of ['Broken', 'Fixed'] as const) {
    for (const leaveAt of ['willPresent', 'visible'] as const) {
      await page.goto('./#/');
      await page.goto('./#/cases/05-ionic-back-button');
      await page.getByRole('tab', { name: variant, exact: true }).click();

      if (leaveAt === 'willPresent') {
        await page.evaluate(() => {
          document.addEventListener('ionModalWillPresent', () => history.back(), { once: true });
        });
      }

      await page.getByRole('button', { name: 'Open task notes', exact: true }).click();

      if (leaveAt === 'visible') {
        await expect(
          page.locator('ion-modal').getByRole('heading', { name: 'Prepare the weekly checklist' }),
        ).toBeVisible();
        await page.goBack();
      }

      await expect(
        page.getByRole('heading', {
          name: 'Little details. Noticeable consequences.',
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.locator('ion-modal')).toHaveCount(0);
      await expect(page.locator('body')).not.toHaveClass(/backdrop-no-scroll/);
      expect(pageErrors).toEqual([]);

      await page.goForward();
      await page.getByRole('button', { name: 'Open task notes', exact: true }).click();
      const modal = page.locator('ion-modal');
      await expect(
        modal.getByRole('heading', { name: 'Prepare the weekly checklist' }),
      ).toBeVisible();
      await modal.getByRole('button', { name: 'Close notes', exact: true }).click();
      await expect(
        modal.getByRole('heading', { name: 'Prepare the weekly checklist' }),
      ).not.toBeVisible();
      expect(pageErrors).toEqual([]);
    }
  }
});
