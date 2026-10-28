# Contributor instructions

Read [docs/SPEC.md](docs/SPEC.md) before making changes. It defines the five cases and the delivery order.

- Write every example from scratch. Do not use code, names, data, screenshots, architecture, or patterns from an employer or client.
- Use a neutral tasks and notifications domain.
- No AI features, backend, secrets, or real APIs. Use in-memory data and mock delays.
- All code, comments, documentation, and commit messages must be English.
- Git author and committer: Massimiliano Borgatti, 82892095+massimilianoborgatti@users.noreply.github.com. Do not use a work email.
- Keep the source in C:\Workspace\angular-bug-clinic, outside synced storage.
- Before pushing, run lint, unit tests, Playwright, and the production Pages build.
- One PR per case, in order after setup. Merge only after green CI; then verify the deployed demo.
- Keep Broken and Fixed close enough to compare. Intentional failing invariants must be expected failures, with explicit symptom checks and a passing Fixed counterpart.
- Log progress in docs/LOG.md. Do not publish the portfolio on Upwork.
