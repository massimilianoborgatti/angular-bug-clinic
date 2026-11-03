import { parseOptionsAndRunCLI } from '@wp-playground/cli';
const variant = process.argv[2];
if (!['broken', 'fixed'].includes(variant)) throw new Error('Choose broken or fixed.');
const port = process.argv[3] || (variant === 'broken' ? '9410' : '9411');
const result = await parseOptionsAndRunCLI([
  'server',
  '--wp',
  '7.1.4',
  '--blueprint',
  'dist/blueprint-' + variant + '-local.json',
  '--mount-dir',
  'dist',
  '/case-assets',
  '--port',
  port,
  '--workers',
  '1',
  '--php-ini',
  'memory_limit',
  '512M',
]);
if ('exitCode' in result) process.exitCode = result.exitCode;
else {
  console.log('Shop fixture ready: ' + variant);
  const stop = async () => {
    await result[Symbol.asyncDispose]();
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
