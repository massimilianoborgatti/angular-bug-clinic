import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
await mkdir(join(output, 'public'), { recursive: true });
const lintSteps = [];
async function collect(directory, base) {
  const entries = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) Object.assign(entries, await collect(path, base));
    else {
      const contents = await readFile(path);
      entries['bug-clinic-shop/' + relative(base, path).replaceAll('\\', '/')] = [
        contents,
        { mtime: new Date('2026-01-01T00:00:00Z') },
      ];
      if (path.endsWith('.php'))
        lintSteps.push({
          step: 'runPHP',
          code:
            "<?php token_get_all(base64_decode('" +
            contents.toString('base64') +
            "'), TOKEN_PARSE); echo 'PHP syntax OK';",
        });
    }
  }
  return entries;
}
for (const variant of ['broken', 'fixed']) {
  const directory = join(root, variant, 'bug-clinic-shop');
  await writeFile(
    join(output, 'public', 'bug-clinic-shop-' + variant + '.zip'),
    zipSync(await collect(directory, directory), { level: 9 }),
  );
  const blueprint = JSON.parse(
    await readFile(join(root, 'blueprint-' + variant + '.json'), 'utf8'),
  );
  await writeFile(
    join(output, 'public', 'blueprint-' + variant + '.json'),
    JSON.stringify(blueprint, null, 2),
  );
  const local = structuredClone(blueprint);
  local.steps.find(
    (step) =>
      step.step === 'installTheme' &&
      step.themeData.resource === 'url' &&
      step.themeData.url.includes('bug-clinic-shop-'),
  ).themeData = {
    resource: 'vfs',
    path: '/case-assets/public/bug-clinic-shop-' + variant + '.zip',
  };
  await writeFile(
    join(output, 'blueprint-' + variant + '-local.json'),
    JSON.stringify(local, null, 2),
  );
}
await writeFile(
  join(output, 'lint-php.json'),
  JSON.stringify({ preferredVersions: { php: '8.3', wp: '7.1.4' }, steps: lintSteps }),
);
console.log('Built both child themes and Playground configurations.');
