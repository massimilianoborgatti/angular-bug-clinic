import { test, expect } from '@playwright/test';
import { cases } from '../src/app/catalog';
for (const item of cases.filter((item) => item.ready)) {
  for (const variant of ['Broken', 'Fixed'] as const) {
    test(item.id + ' ' + variant + ' portfolio screenshot', async ({ page }) => {
      await page.goto('./#/cases/' + item.slug);
      await page.getByRole('tab', { name: variant, exact: true }).click();
      if (item.id === '01') {
        for (let visit = 0; visit < 3; visit++) {
          await page.getByRole('button', { name: 'Navigate away', exact: true }).click();
          await page.getByRole('button', { name: 'Return to widget', exact: true }).click();
        }
        await page.getByRole('button', { name: 'Emit notification', exact: true }).click();
        await expect(page.getByTestId('handler-calls')).toHaveText(
          variant === 'Broken' ? '4' : '1',
        );
      } else if (item.id === '02') {
        await page.getByRole('button', { name: 'Add task', exact: true }).click();
        await expect(page.getByTestId('parent-count')).toHaveText('3');
        await expect(page.getByTestId('child-count')).toHaveText(variant === 'Broken' ? '2' : '3');
      } else if (item.id === '03') {
        await page.getByRole('button', { name: 'Reproduce race', exact: true }).click();
        await expect(
          page.getByRole('button', { name: 'Reproduce race', exact: true }),
        ).toBeEnabled();
        await expect(page.getByTestId('checked-username')).toHaveText(
          variant === 'Broken' ? 'taken' : 'freshname',
        );
      } else if (item.id === '04') {
        await page.getByRole('button', { name: 'Open protected tasks', exact: true }).click();
        if (variant === 'Broken') await expect(page.getByTestId('guard-stopped')).toBeVisible();
        else {
          await expect(page.getByTestId('guard-login')).toBeVisible();
          await page.getByRole('button', { name: 'Log in to demo', exact: true }).click();
          await expect(page.getByTestId('guard-tasks')).toBeVisible();
        }
      } else if (item.id === '05') {
        await page.getByRole('button', { name: 'Open task notes', exact: true }).click();
        const modal = page.locator('ion-modal');
        await expect(
          modal.getByRole('heading', { name: 'Prepare the weekly checklist' }),
        ).toBeVisible();
        await modal.getByRole('button', { name: 'Simulate hardware back', exact: true }).click();
        if (variant === 'Fixed')
          await expect(
            modal.getByRole('heading', { name: 'Prepare the weekly checklist' }),
          ).not.toBeVisible();
        else await expect(modal.getByTestId('underlying-page')).toHaveText('Task list');
      }
      await page.screenshot({
        path: 'docs/screenshots/' + item.id + '-' + variant.toLowerCase() + '.png',
        fullPage: false,
        animations: 'disabled',
      });
    });
  }
}
