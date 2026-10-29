# Contributor guide

Read [docs/OVERVIEW.md](docs/OVERVIEW.md) before making changes.

- Use a neutral tasks and notifications domain with in-memory mock data and artificial delays.
- Add no backend, secrets, or real external APIs.
- Use standalone Angular components, signals where appropriate, strict TypeScript, and built-in control flow.
- Keep all code, comments, documentation, and commit messages in English.
- Keep Broken and Fixed implementations minimal and comparable. Shared code should make the focused repair easy to see.
- Test the same desired invariant against both versions. Broken is an expected failure with a separate explicit symptom check; Fixed passes normally. An unexpected Broken pass must fail the suite.
- Use controlled clocks or mock delays for asynchronous regressions. Avoid timing-dependent assertions.
- Update the case README with the symptom, reproduction, root cause, fix, test evidence, and takeaway.
- Before pushing, run `npm run format:check`, `npm run verify`, and `npm run e2e:pages`.
- Use one pull request per change and conventional commit messages. Merge only with green CI, then verify the deployed demo.
- Log useful technical progress and validation results in [docs/LOG.md](docs/LOG.md).
