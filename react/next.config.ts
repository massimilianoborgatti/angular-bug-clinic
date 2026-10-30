import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
  basePath: '/angular-bug-clinic/react',
  trailingSlash: true,
};
export default config;
