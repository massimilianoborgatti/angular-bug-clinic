import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // This case intentionally demonstrates an unstable dependency in Broken.
  { files: ['src/broken-orders.tsx'], rules: { 'react-hooks/exhaustive-deps': 'off' } },
  globalIgnores([
    '.next/**',
    'public/mockServiceWorker.js',
    'out/**',
    'next-env.d.ts',
    'coverage/**',
    'test-results/**',
    'playwright-report/**',
  ]),
]);
