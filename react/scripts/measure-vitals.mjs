import lighthouse from 'lighthouse';
import { createServer } from 'node:net';
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
const base = 'http://127.0.0.1:4400/angular-bug-clinic/react/';
const output = '.lighthouseci';
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const failures = (metrics) =>
  Object.entries({ LCP: metrics.LCP < 2500, CLS: metrics.CLS < 0.1, TBT: metrics.TBT < 200 })
    .filter(([, passes]) => !passes)
    .map(([name]) => name);
const preview = spawn(process.execPath, ['scripts/serve.mjs'], {
  stdio: 'ignore',
  env: { ...process.env, STATIC_GZIP: '1' },
});
let previewError;
preview.on('error', (error) => {
  previewError = error;
});
try {
  await mkdir(output, { recursive: true });
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (previewError) throw previewError;
    try {
      ready = (await fetch(base, { signal: AbortSignal.timeout(500) })).ok;
    } catch {
      /* The preview may not be listening yet. */
    }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw Error('Static preview did not become ready');
  const results = { broken: [], fixed: [] };
  for (let run = 1; run <= 3; run++)
    for (const variant of ['broken', 'fixed']) {
      const port = await new Promise((resolve) => {
        const socket = createServer();
        socket.listen(0, '127.0.0.1', () => {
          const assigned = socket.address().port;
          socket.close(() => resolve(assigned));
        });
      });
      const chrome = await chromium.launch({ args: [`--remote-debugging-port=${port}`] });
      try {
        const result = await lighthouse(base + 'cases/12-core-web-vitals/' + variant + '/', {
          port,
          logLevel: 'error',
          output: 'json',
          onlyCategories: ['performance'],
        });
        if (!result || result.lhr.runtimeError)
          throw Error(result?.lhr.runtimeError?.message || 'Missing Lighthouse result');
        const lhr = result.lhr;
        const metrics = {
          LCP: lhr.audits['largest-contentful-paint'].numericValue,
          CLS: lhr.audits['cumulative-layout-shift'].numericValue,
          TBT: lhr.audits['total-blocking-time'].numericValue,
          score: lhr.categories.performance.score * 100,
        };
        results[variant].push(metrics);
        await writeFile(`${output}/${variant}-${run}.json`, result.report);
        console.log(variant, run, JSON.stringify(metrics));
      } finally {
        await chrome.close();
      }
    }
  const summary = {};
  for (const variant of ['broken', 'fixed'])
    summary[variant] = Object.fromEntries(
      ['LCP', 'CLS', 'TBT', 'score'].map((key) => [
        key,
        median(results[variant].map((run) => run[key])),
      ]),
    );
  await writeFile(
    output + '/summary.json',
    JSON.stringify(
      {
        lighthouseVersion: '13.6.0',
        preset: 'default mobile, simulated Slow 4G, cold browser per run',
        runs: results,
        medians: summary,
      },
      null,
      2,
    ),
  );
  console.log('MEDIANS', JSON.stringify(summary));
  if (failures(summary.fixed).length)
    throw Error('Fixed budget failures: ' + failures(summary.fixed).join(', '));
  if (!failures(summary.broken).length) throw Error('Broken unexpectedly passed all budgets');
  console.log('PASS Fixed budgets: LCP <2500 ms, CLS <0.1, TBT <200 ms');
  console.log('EXPECTED FAILURE Broken budgets:', failures(summary.broken).join(', '));
} finally {
  preview.kill();
}
