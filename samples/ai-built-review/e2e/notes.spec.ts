import { test, expect, type Page } from '@playwright/test';
const payload =
  '<img src="/missing-demo-image" onerror="document.documentElement.dataset.noteXss=\'executed\'">';
async function open(page: Page, variant: string) {
  await page.goto('/' + variant + '/');
  await expect(page.getByRole('button', { name: 'Welcome notes', exact: true })).toBeVisible();
}
for (const variant of ['broken', 'fixed']) {
  test(variant + ': another team cannot be read through a shared note ID', async ({ request }) => {
    const response = await request.get('/api/' + variant + '/notes?id=red-note&teamId=team-red');
    expect(response.status()).toBeLessThan(500);
    test.fail(
      variant === 'broken',
      'The baseline looks up a note without checking team membership.',
    );
    expect(response.status()).toBe(403);
    expect(await response.text()).not.toContain('Red team planning notes.');
  });
  test(variant + ': saved markup is inert text', async ({ page, request }) => {
    const response = await request.post('/api/' + variant + '/notes', {
      data: { title: 'Markup check', body: payload },
    });
    expect(response.ok()).toBe(true);
    const { note } = await response.json();
    await page.goto('/' + variant + '/?note=' + note.id);
    await expect(page.getByTestId('note-body')).toBeVisible();
    if (variant === 'broken')
      await expect(page.locator('html')).toHaveAttribute('data-note-xss', 'executed');
    test.fail(variant === 'broken', 'The baseline inserts the saved SVG as active markup.');
    await expect(page.getByTestId('note-body')).toHaveText(payload);
    await expect(page.locator('html')).not.toHaveAttribute('data-note-xss');
    await expect(page.getByTestId('note-body').locator('svg')).toHaveCount(0);
  });
  test(variant + ': invalid note input receives a useful 400 response', async ({ request }) => {
    const response = await request.post('/api/' + variant + '/notes', {
      data: { title: '', body: '' },
    });
    expect(response.status()).toBeLessThan(500);
    test.fail(variant === 'broken', 'The baseline accepts empty values.');
    expect(response.status()).toBe(400);
    expect((await response.json()).error).toContain('1-80');
  });
  test(variant + ': search keeps the newest response', async ({ page }) => {
    await settleSearchRace(page, variant);
    test.fail(variant === 'broken', 'An old response replaces the current query results.');
    await expect(page.getByRole('button', { name: 'fern plan', exact: true })).toBeVisible();
  });
  test(variant + ': a draft snapshot follows the current body', async ({ page }) => {
    await page.clock.install();
    await open(page, variant);
    await page.getByRole('textbox', { name: 'Body', exact: true }).fill('Revised draft');
    await page.clock.runFor(1200);
    test.fail(variant === 'broken', 'The interval captures the initial body.');
    await expect(page.getByTestId('draft-snapshot')).toHaveText('Revised draft');
  });
  test(variant + ': a failed query is identified as an error', async ({ page }) => {
    await open(page, variant);
    await page.route('**/api/' + variant + '/notes?q=*', (route) =>
      route.fulfill({ status: 503, json: { error: 'Temporary sample failure.' } }),
    );
    const failed = page.waitForResponse(
      (r) => r.url().includes('/notes?q=unavailable') && r.status() === 503,
    );
    await page.getByRole('searchbox').fill('unavailable');
    await failed;
    test.fail(variant === 'broken', 'The baseline mistakes a failed response for an empty list.');
    await expect(page.getByRole('main').getByRole('alert')).toContainText('Could not load notes.');
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  });
  test(variant + ': one search rule handles case consistently', async ({ page }) => {
    await open(page, variant);
    await page.getByRole('searchbox').fill('WELCOME');
    test.fail(variant === 'broken', 'A second case-sensitive filter discards a valid API result.');
    await expect(page.getByRole('button', { name: 'Welcome notes', exact: true })).toBeVisible();
  });
}
test('Broken explicitly exposes cross-team data, accepts caller ownership and executes a local DOM marker', async ({
  page,
  request,
}) => {
  const leaked = await request.get('/api/broken/notes?id=red-note');
  expect((await leaked.json()).note.body).toBe('Red team planning notes.');
  const accepted = await request.post('/api/broken/notes', {
    data: { title: '', body: '', teamId: 'team-red' },
  });
  expect(accepted.status()).toBe(200);
  expect((await accepted.json()).note.teamId).toBe('team-red');
  const saved = await request.post('/api/broken/notes', {
    data: { title: 'Local marker', body: payload },
  });
  const { note } = await saved.json();
  await page.goto('/broken/?note=' + note.id);
  await expect(page.locator('html')).toHaveAttribute('data-note-xss', 'executed');
});
test('Fixed creates and opens an owned team link with keyboard controls at 375px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await open(page, 'fixed');
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Keyboard note');
  await page.getByRole('textbox', { name: 'Body', exact: true }).fill('A local team note.');
  await page.getByRole('button', { name: 'Save note' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Keyboard note', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Team-only share link' }).click();
  await expect(page.getByTestId('note-body')).toHaveText('A local team note.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const response = await page.request.get('/api/fixed/notes');
  expect(
    (await response.json()).notes.every((n: { teamId: string }) => n.teamId === 'team-blue'),
  ).toBe(true);
});

async function settleSearchRace(page: Page, variant: string) {
  await open(page, variant);
  let release!: () => void, started!: () => void, finished!: () => void;
  const held = new Promise<void>((r) => (release = r)),
    oldStarted = new Promise<void>((r) => (started = r)),
    oldFinished = new Promise<void>((r) => (finished = r));
  await page.route('**/api/' + variant + '/notes?q=*', async (route) => {
    const q = new URL(route.request().url()).searchParams.get('q');
    if (q === 'pine') {
      started();
      await held;
    }
    try {
      await route.fulfill({
        json: { notes: [{ id: q, teamId: 'team-blue', title: q + ' plan', body: 'Draft' }] },
      });
    } finally {
      if (q === 'pine') finished();
    }
  });
  try {
    await page.getByRole('searchbox').fill('pine');
    await oldStarted;
    await page.getByRole('searchbox').fill('fern');
    await expect(page.getByRole('button', { name: 'fern plan', exact: true })).toBeVisible();
    release();
    await oldFinished;
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    if (variant === 'broken')
      await expect(page.getByRole('button', { name: 'fern plan', exact: true })).toHaveCount(0);
  } finally {
    release();
  }
}

test('Broken explicitly loses the newest search after the old response settles', async ({
  page,
}) => {
  await settleSearchRace(page, 'broken');
  await expect(page.getByRole('button', { name: 'fern plan', exact: true })).toHaveCount(0);
});
test('Broken explicitly keeps the initial snapshot, discards uppercase results and hides a query failure', async ({
  page,
}) => {
  await page.clock.install();
  await open(page, 'broken');
  await page.getByRole('textbox', { name: 'Body', exact: true }).fill('Revised draft');
  await page.clock.runFor(1200);
  await expect(page.getByTestId('draft-snapshot')).toHaveText('First draft');
  const found = page.waitForResponse((r) => r.url().includes('q=WELCOME'));
  await page.getByRole('searchbox').fill('WELCOME');
  await found;
  await expect(page.getByRole('button', { name: 'Welcome notes', exact: true })).toHaveCount(0);
  await page.route('**/api/broken/notes?q=unavailable', (route) =>
    route.fulfill({ status: 503, json: { error: 'Temporary sample failure.' } }),
  );
  const failed = page.waitForResponse((r) => r.status() === 503);
  await page.getByRole('searchbox').fill('unavailable');
  await failed;
  await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
  await expect(page.getByText('No notes found.', { exact: true })).toBeVisible();
  await expect(page.getByText(/DEMO_KEY_NOT_A_REAL_SECRET/)).toBeVisible();
});
