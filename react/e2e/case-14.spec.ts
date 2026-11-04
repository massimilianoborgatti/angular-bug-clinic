import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
const base = 'cases/14-code-review-sample/';
test('14 compares recorded evidence by keyboard without executing the local sample', async ({
  page,
  request,
}) => {
  const apiRequests: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/api/')) apiRequests.push(r.url());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('./' + base);
  await expect(page).toHaveTitle('Sample code review: Northwind Notes | Bug Clinic');
  await expect(page.getByTestId('review-evidence')).toContainText('200: Red team');
  const fixed = page.getByRole('tab', { name: 'Fixed', exact: true });
  await expect(async () => {
    await fixed.click();
    await expect(fixed).toHaveAttribute('aria-selected', 'true', { timeout: 1000 });
  }).toPass({ timeout: 10000 });
  await expect(page.getByTestId('review-evidence')).toContainText('403: Red team');
  await expect(page.getByTestId('review-evidence')).toContainText('400: invalid fields');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Broken', exact: true })).toBeFocused();
  await expect(page.getByTestId('review-evidence')).toContainText('Saved markup executes');
  await page.keyboard.press('End');
  await expect(fixed).toBeFocused();
  await expect(page.getByText('Recorded local test outcomes.', { exact: false })).toBeVisible();
  expect(apiRequests).toEqual([]);
  expect(errors).toEqual([]);
  expect((await request.get('./api/fixed/notes')).status()).toBe(404);
});
test('14 full report preserves every heading, finding and real diff from Markdown', async ({
  page,
  request,
}) => {
  const markdown = await readFile('../docs/samples/code-review-sample.md', 'utf8');
  await page.goto('./' + base + 'report/');
  const article = page.locator('.report-content');
  await expect(article.locator('h1,h2,h3')).toHaveText(
    [...markdown.matchAll(/^#{1,3} (.+)$/gm)].map((m) => m[1]),
  );
  const diffs = [...markdown.matchAll(/```diff\n([\s\S]*?)\n```/g)].map((m) => m[1] + '\n');
  expect(await article.locator('pre code').allTextContents()).toEqual(diffs);
  await expect(article.locator('tbody tr')).toHaveCount(9);
  await expect(article.locator('blockquote').first()).toHaveText(
    'Fictional app, sample report. Not a security certification or penetration test',
  );
  await expect(page.locator('html')).not.toHaveAttribute('data-note-xss');
  const response = await request.get('./case-14/code-review-sample.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  const bytes = await response.body();
  expect(bytes.toString('latin1')).toContain(createHash('sha256').update(markdown).digest('hex'));
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  expect(bytes.length).toBeLessThan(1000000);
  expect(bytes.equals(await readFile('public/case-14/code-review-sample.pdf'))).toBe(true);
});
test('14 summary and report remain usable at 375px and have no serious axe findings', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 844 });
  for (const path of [base, base + 'report/']) {
    await page.goto('./' + path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const result = await new AxeBuilder({ page })
      .include(path.endsWith('report/') ? '.report-content' : '.review-page')
      .analyze();
    expect(
      result.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => v.id),
    ).toEqual([]);
  }
});
