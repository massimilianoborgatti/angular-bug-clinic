import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
export async function readReport() {
  return readFile(resolve(process.cwd(), '../docs/samples/code-review-sample.md'), 'utf8');
}
export function ownerSummary(markdown: string) {
  const summary = markdown
    .split('## Summary for the owner\n\n')[1]
    ?.split('\n## Scope and method')[0];
  if (!summary) throw Error('Missing owner summary');
  return summary.trim().split('\n\n').slice(0, 2).join('\n\n');
}
