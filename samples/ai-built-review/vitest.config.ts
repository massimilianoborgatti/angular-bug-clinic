import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['fixed/tests/**/*.test.ts', 'fixed/tests/**/*.test.tsx'], environment: 'node' },
});
