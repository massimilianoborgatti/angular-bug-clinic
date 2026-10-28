import { expect, test } from '@playwright/test';

for (const mode of ['Broken', 'Fixed'] as const) {
  test(`${mode}: a guest reaches login exactly once`, async ({ page }) => {
    test.fail(mode === 'Broken', 'Guarding login re-enters the guard until the safety stop.');
    await page.goto('./#/cases/04-guard-redirect-loop');
    await page.getByRole('tab', { name: mode, exact: true }).click();
    await page.getByRole('button', { name: 'Open protected tasks', exact: true }).click();
    await expect(page.getByTestId('guard-login')).toBeVisible();
    await expect(page.getByTestId('redirect-count')).toHaveText('1');
  });
}

test('Broken shows a bounded redirect loop instead of freezing the app', async ({ page }) => {
  await page.goto('./#/cases/04-guard-redirect-loop');
  await page.getByRole('button', { name: 'Open protected tasks', exact: true }).click();
  await expect(page.getByTestId('guard-stopped')).toBeVisible();
  await expect(page.getByTestId('redirect-count')).toHaveText('4');
  await expect(page).toHaveURL(/broken\/stopped$/);
});

test('Fixed returns to the original task list after login', async ({ page }) => {
  await page.goto('./#/cases/04-guard-redirect-loop');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await page.getByRole('button', { name: 'Open protected tasks', exact: true }).click();
  await expect(page.getByTestId('guard-login')).toBeVisible();
  await page.getByRole('button', { name: 'Log in to demo', exact: true }).click();
  await expect(page.getByTestId('guard-tasks')).toBeVisible();
  await expect(page.getByTestId('redirect-count')).toHaveText('1');
  await expect(page).toHaveURL(/fixed\/tasks$/);
});

test('switching from a Broken child route clears the old outlet and resets the session', async ({
  page,
}) => {
  await page.goto('./#/cases/04-guard-redirect-loop');
  await page.getByRole('button', { name: 'Open protected tasks', exact: true }).click();
  await expect(page.getByTestId('guard-stopped')).toBeVisible();
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await expect(page.getByTestId('guard-stopped')).not.toBeVisible();
  await expect(page.getByTestId('redirect-count')).toHaveText('0');
  await expect(page).toHaveURL(/04-guard-redirect-loop$/);
  await page.getByRole('button', { name: 'Open protected tasks', exact: true }).click();
  await expect(page.getByTestId('guard-login')).toBeVisible();
  await page.getByRole('button', { name: 'Log in to demo', exact: true }).click();
  await expect(page.getByTestId('guard-tasks')).toBeVisible();
  await page.getByRole('tab', { name: 'Broken', exact: true }).click();
  await expect(page.getByTestId('guard-tasks')).not.toBeVisible();
  await expect(page.getByTestId('redirect-count')).toHaveText('0');
  await expect(page).toHaveURL(/04-guard-redirect-loop$/);
  await page.getByRole('button', { name: 'Open protected tasks', exact: true }).click();
  await expect(page.getByTestId('guard-stopped')).toBeVisible();
});

test('directly loading a Fixed child route preserves the tab and login flow', async ({ page }) => {
  await page.goto('./#/cases/04-guard-redirect-loop/fixed/tasks');
  await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByTestId('guard-login')).toBeVisible();
  await expect(page.getByTestId('redirect-count')).toHaveText('1');
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByTestId('guard-login')).toBeVisible();
});

test('Fixed can replay a guest navigation after the task list has already opened', async ({
  page,
}) => {
  await page.goto('./#/cases/04-guard-redirect-loop');
  await page.getByRole('tab', { name: 'Fixed', exact: true }).click();
  await page.getByRole('button', { name: 'Open protected tasks', exact: true }).click();
  await page.getByRole('button', { name: 'Log in to demo', exact: true }).click();
  await expect(page.getByTestId('guard-tasks')).toBeVisible();
  await page.getByRole('button', { name: 'Open protected tasks', exact: true }).click();
  await expect(page.getByTestId('guard-login')).toBeVisible();
  await expect(page.getByTestId('guard-tasks')).not.toBeVisible();
  await expect(page.getByTestId('redirect-count')).toHaveText('1');
});

test('child hash navigation synchronizes the reused parent even when a route variant repeats', async ({
  page,
}) => {
  await page.goto('./#/cases/04-guard-redirect-loop');
  await expect(page.getByRole('tab', { name: 'Broken', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await page.evaluate(() => {
    location.hash = '#/cases/04-guard-redirect-loop/fixed/tasks';
  });
  await expect(page).toHaveURL(/fixed\/login\?returnUrl=/);
  await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByTestId('guard-login')).toBeVisible();

  await page.getByRole('tab', { name: 'Broken', exact: true }).click();
  await expect(page).toHaveURL(/04-guard-redirect-loop$/);
  await expect(page.getByRole('tab', { name: 'Broken', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByTestId('guard-login')).not.toBeVisible();

  // The route mode is Fixed again, but the intervening manual tab selection must be replaced.
  await page.evaluate(() => {
    location.hash = '#/cases/04-guard-redirect-loop/fixed/tasks';
  });
  await expect(page).toHaveURL(/fixed\/login\?returnUrl=/);
  await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByTestId('guard-login')).toBeVisible();
});

test('browser history keeps the selected tab aligned with its child route', async ({ page }) => {
  await page.goto('./#/cases/04-guard-redirect-loop');
  await page.evaluate(() => {
    location.hash = '#/cases/04-guard-redirect-loop/fixed/tasks';
  });
  await expect(page.getByTestId('guard-login')).toBeVisible();

  await page.evaluate(() => {
    location.hash = '#/cases/04-guard-redirect-loop/broken/tasks';
  });
  await expect(page.getByTestId('guard-stopped')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Broken', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await page.goBack();
  await expect(page.getByTestId('guard-login')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Fixed', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await page.goForward();
  await expect(page.getByTestId('guard-stopped')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Broken', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});
