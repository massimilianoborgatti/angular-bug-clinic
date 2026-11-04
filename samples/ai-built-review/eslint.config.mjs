import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // The baseline intentionally captures the initial draft in an interval.
  { files: ['broken/notes-client.tsx'], rules: { 'react-hooks/exhaustive-deps': 'off' } },
  globalIgnores(['.next/**', 'next-env.d.ts', 'test-results/**', 'playwright-report/**']),
]);
