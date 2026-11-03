import './build.mjs';
import { parseOptionsAndRunCLI } from '@wp-playground/cli';
const result = await parseOptionsAndRunCLI(['run-blueprint', '--blueprint', 'dist/lint-php.json']);
if ('exitCode' in result) process.exitCode = result.exitCode;
else await result[Symbol.asyncDispose]();
