import { expect, test } from '@playwright/test';

for (const variant of ['Broken', 'Fixed'] as const) {
  test(
    '01 ' + variant + ': one mounted widget handles one notification after three visits',
    async ({ page }) => {
      test.fail(
        variant === 'Broken',
        'The same cleanup contract detects the retained subscriptions.',
      );
      const logLines: string[] = [];
      page.on('console', (message) => {
        if (message.text().startsWith('[case-01]')) {
          logLines.push(message.text());
        }
      });
      await page.goto('./#/cases/01-subscription-leak');
      await page.getByRole('tab', { name: variant, exact: true }).click();

      for (let visit = 0; visit < 3; visit++) {
        await page.getByRole('button', { name: 'Navigate away', exact: true }).click();
        await page.getByRole('button', { name: 'Return to widget', exact: true }).click();
      }
      await page.getByRole('button', { name: 'Emit notification', exact: true }).click();
      await expect(page.getByTestId('emitted-count')).toHaveText('1');
      await expect(page.getByTestId('widget-received')).toHaveText('1');

      // Broken logs four handlers; Fixed logs only the current widget's handler.
      expect(logLines).toHaveLength(1);
      await expect(page.getByTestId('handler-calls')).toHaveText('1');
    },
  );
}

test('01 Broken visibly retains a handler after its widget is unmounted', async ({ page }) => {
  await page.goto('./#/cases/01-subscription-leak');
  await page.getByRole('tab', { name: 'Broken', exact: true }).click();
  await page.getByRole('button', { name: 'Navigate away', exact: true }).click();
  await expect(page.getByText('Widget is unmounted', { exact: true })).toBeVisible();
  await expect(page.getByTestId('active-subscriptions')).toHaveText('1');
  await page.getByRole('button', { name: 'Emit notification', exact: true }).click();
  await expect(page.getByTestId('handler-calls')).toHaveText('1');
  await expect(page.getByTestId('event-log')).toContainText('Widget #1 handled notification 1');
});

test('01 Fixed visibly releases its handler when its widget is unmounted', async ({ page }) => {
  await page.goto('./#/cases/01-subscription-leak');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await page.getByRole('button', { name: 'Navigate away', exact: true }).click();
  await expect(page.getByTestId('active-subscriptions')).toHaveText('0');
  await page.getByRole('button', { name: 'Emit notification', exact: true }).click();
  await expect(page.getByTestId('handler-calls')).toHaveText('0');
});
