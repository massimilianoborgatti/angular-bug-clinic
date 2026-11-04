import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, stat } from 'node:fs/promises';
const base = 'http://127.0.0.1:4400/angular-bug-clinic/react/';
const preview = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: 'ignore' });
let browser;
try {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {
      // The preview may still be starting.
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  browser = await chromium.launch();
  await mkdir('../docs/screenshots', { recursive: true });
  for (const width of [1440, 375]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      deviceScaleFactor: 1,
      colorScheme: 'light',
    });
    await page.goto(base + 'case-13/reference.html');
    await page.evaluate(() => document.fonts.ready);
    const path = '../docs/screenshots/13-reference-' + width + '.png';
    await page.screenshot({ path, fullPage: true, animations: 'disabled' });
    if ((await stat(path)).size >= 1000000) throw Error('Design image exceeds the asset limit');
    console.log('Captured original HTML/CSS design at', width, 'pixels');
    await page.close();
  }
} finally {
  await browser?.close();
  preview.kill();
}
