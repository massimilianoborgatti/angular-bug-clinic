import { expect, test } from '@playwright/test';

for (const variant of ['Broken', 'Fixed'] as const) {
  test('02 ' + variant + ': adding a task updates the OnPush child', async ({ page }) => {
    test.fail(variant === 'Broken', 'The same render contract detects the stale child view.');
    await page.goto('./#/cases/02-onpush-stale-view');
    await page.getByRole('tab', { name: variant, exact: true }).click();
    await expect(page.getByTestId('child-count')).toHaveText('2');
    await page.getByRole('button', { name: 'Add task', exact: true }).click();
    await expect(page.getByTestId('parent-count')).toHaveText('3');

    // Broken remains at two; Fixed receives a new input reference and renders three.
    await expect(page.getByTestId('child-count')).toHaveText('3');
    await expect(page.getByTestId('child-task-list')).toContainText('Prepare task 3');
  });
}

test('02 Broken visibly shows different parent and child counts', async ({ page }) => {
  await page.goto('./#/cases/02-onpush-stale-view');
  await page.getByRole('tab', { name: 'Broken', exact: true }).click();
  await page.getByRole('button', { name: 'Add task', exact: true }).click();
  await expect(page.getByTestId('parent-count')).toHaveText('3');
  await expect(page.getByTestId('child-count')).toHaveText('2');
  await expect(page.getByTestId('child-task-list')).not.toContainText('Prepare task 3');
});

test('02 Fixed renders repeated immutable updates', async ({ page }) => {
  await page.goto('./#/cases/02-onpush-stale-view');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await page.getByRole('button', { name: 'Add task', exact: true }).click();
  await page.getByRole('button', { name: 'Add task', exact: true }).click();
  await expect(page.getByTestId('parent-count')).toHaveText('4');
  await expect(page.getByTestId('child-count')).toHaveText('4');
  await expect(page.getByTestId('child-task-list')).toContainText('Prepare task 4');
});
