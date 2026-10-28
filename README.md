# Angular Bug Clinic

A collection of real-world Angular/Ionic bugs, each with a broken version, a fix, a test and a write-up. The examples are original, use neutral in-memory tasks and notifications, and can be explored in about two minutes each.

[Open the live demo](https://massimilianoborgatti.github.io/angular-bug-clinic/) · [Source](https://github.com/massimilianoborgatti/angular-bug-clinic)

## Cases

| Case                      | Write-up                                                | Demo                                                                                              | Pull request                                                                                                                |
| ------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 01 — Subscription leak    | [Read](src/app/cases/01-subscription-leak/README.md)    | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/01-subscription-leak)    | [Case PR](https://github.com/massimilianoborgatti/angular-bug-clinic/pulls?q=is%3Apr+head%3Acase%2F01-subscription-leak)    |
| 02 — OnPush stale view    | [Read](src/app/cases/02-onpush-stale-view/README.md)    | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/02-onpush-stale-view)    | [Case PR](https://github.com/massimilianoborgatti/angular-bug-clinic/pulls?q=is%3Apr+head%3Acase%2F02-onpush-stale-view)    |
| 03 — Async validator race | [Read](src/app/cases/03-async-validator-race/README.md) | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/03-async-validator-race) | [Case PR](https://github.com/massimilianoborgatti/angular-bug-clinic/pulls?q=is%3Apr+head%3Acase%2F03-async-validator-race) |
| 04 — Guard redirect loop  | [Read](src/app/cases/04-guard-redirect-loop/README.md)  | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/04-guard-redirect-loop)  | [Case PR](https://github.com/massimilianoborgatti/angular-bug-clinic/pulls?q=is%3Apr+head%3Acase%2F04-guard-redirect-loop)  |
| 05 — Ionic back button    | Coming in its case PR                                   | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/05-ionic-back-button)    | Pending                                                                                                                     |

## Run locally

Use Node.js 24.15 or later within the 24.x release line.

```sh
npm ci
npx playwright install chromium
npm start
```

Open http://127.0.0.1:4200. Hash routing supports direct case links and reloads on GitHub Pages without a backend or redirect workaround.

## Verify

```sh
npm run format:check
npm run verify
npm run e2e:pages
```

CI runs formatting, ESLint, Vitest unit tests, Playwright browser tests and the production Pages build. It also serves that production build under /angular-bug-clinic/ and repeats browser tests to verify the base path. Only successful main CI runs can trigger the Pages deployment.

The desired behavior is tested against both versions. Broken is marked as an expected failure; an unexpected pass fails the suite. A separate passing test checks the specific visible bug so a random exception cannot be mistaken for proof. Fixed must satisfy the same invariant normally.

## Stack

Angular 22.2 (standalone, signals, strict TypeScript, built-in control flow), RxJS, the Angular CLI default Vitest runner, angular-eslint, Prettier, Playwright and GitHub Actions. Ionic is added only for case 05. Versions are pinned by package-lock.json.

## Portfolio material

Case PRs add two 1600 × 1200 screenshots each and entries to [the portfolio copy](docs/upwork/portfolio-items.md). Publishing on Upwork is a manual owner step. [Specification](docs/SPEC.md) · [Progress log](docs/LOG.md).

## License

[MIT](LICENSE). Maintained by [massimilianoborgatti](https://github.com/massimilianoborgatti).
