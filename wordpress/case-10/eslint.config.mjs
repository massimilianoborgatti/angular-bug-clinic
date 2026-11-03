import js from '@eslint/js';
export default [
  { ignores: ['node_modules/**', 'dist/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        structuredClone: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
  },
  {
    files: ['**/cart.js'],
    languageOptions: {
      globals: { jQuery: 'readonly', document: 'readonly', MutationObserver: 'readonly' },
    },
  },
];
