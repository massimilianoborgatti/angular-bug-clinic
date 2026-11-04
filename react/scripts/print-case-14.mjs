import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat } from 'node:fs/promises';
const url = 'http://127.0.0.1:4400/angular-bug-clinic/react/cases/14-code-review-sample/report/';
const markdown = await readFile('../docs/samples/code-review-sample.md', 'utf8');
const digest = createHash('sha256').update(markdown).digest('hex');
const preview = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: 'ignore' });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try {
      ready = (await fetch(url)).ok;
    } catch {
      /* The preview is still starting. */
    }
    if (ready) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!ready) throw Error('Build the report before printing.');
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  if ((await page.locator('.report-content').getAttribute('data-source-sha256')) !== digest)
    throw Error('Rebuild: the web report does not match the current Markdown.');
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate((hash) => {
    document.title = 'Northwind Notes sample report | source ' + hash;
  }, digest);
  await mkdir('public/case-14', { recursive: true });
  const path = 'public/case-14/code-review-sample.pdf';
  await page.pdf({
    path,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="font:8px Arial;width:100%;margin:0 16mm;display:flex;justify-content:space-between;color:#52634c"><span>Northwind Notes | Source ${digest.slice(0, 12)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    margin: { top: '16mm', right: '16mm', bottom: '18mm', left: '16mm' },
  });
  const { size } = await stat(path);
  if (size >= 1000000) throw Error('PDF exceeds the one-million-byte limit.');
  console.log('Printed sample report:', size, 'bytes; source', digest);
} finally {
  await browser?.close();
  preview.kill();
}
