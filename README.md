# Angular Bug Clinic

A collection of real-world Angular, Ionic and React bugs, each with a broken version, a fix, a test and a write-up. The examples are original, use neutral in-memory tasks, notifications and orders, and can be explored in about two minutes each.

[Open the live demo](https://massimilianoborgatti.github.io/angular-bug-clinic/) · [Source](https://github.com/massimilianoborgatti/angular-bug-clinic)

## Cases

| Case                            | Write-up                                                | Demo                                                                                                | Code changes                                                                                                            |
| ------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 01 — Subscription leak          | [Read](src/app/cases/01-subscription-leak/README.md)    | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/01-subscription-leak)      | [Case diff](https://github.com/massimilianoborgatti/angular-bug-clinic/compare/f99122abe33b...66ddd5df9401)             |
| 02 — OnPush stale view          | [Read](src/app/cases/02-onpush-stale-view/README.md)    | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/02-onpush-stale-view)      | [Case diff](https://github.com/massimilianoborgatti/angular-bug-clinic/compare/66ddd5df9401...e7dc28931144)             |
| 03 — Async validator race       | [Read](src/app/cases/03-async-validator-race/README.md) | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/03-async-validator-race)   | [Case diff](https://github.com/massimilianoborgatti/angular-bug-clinic/compare/e7dc28931144...fd0ac843fca6)             |
| 04 — Guard redirect loop        | [Read](src/app/cases/04-guard-redirect-loop/README.md)  | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/04-guard-redirect-loop)    | [Case diff](https://github.com/massimilianoborgatti/angular-bug-clinic/compare/c6040243cde7...c1d255ca08e7)             |
| 05 — Ionic back button          | [Read](src/app/cases/05-ionic-back-button/README.md)    | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/05-ionic-back-button)      | [Case diff](https://github.com/massimilianoborgatti/angular-bug-clinic/compare/c1d255ca08e7...34af5bd11a04)             |
| 06 — React effect loop          | [Read](react/README.md)                                 | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/react/)                            | [Broken](react/src/broken-orders.tsx) → [Fixed](react/src/fixed-orders.tsx)                                             |
| 07 — Refresh token race         | [Read](react/cases/07-node-refresh-race/README.md)      | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/07-node-refresh-race/) | [Broken](react/src/refresh/broken-refresh.ts) → [Fixed](react/src/refresh/fixed-refresh.ts)                             |
| 08 — Keyboard-safe dialog       | [Read](src/app/cases/08-keyboard-dialog/README.md)      | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/08-keyboard-dialog)        | [Broken](src/app/cases/08-keyboard-dialog/broken-dialog.ts) → [Fixed](src/app/cases/08-keyboard-dialog/fixed-dialog.ts) |
| 09 — Accessible form errors     | [Read](react/cases/09-form-errors/README.md)            | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/09-form-errors/)       | [Shared form (Broken/Fixed)](react/src/signup-form.tsx)                                                                 |
| 10 — WooCommerce cart fragments | [Read](docs/cases/10-woocommerce-cart.md)               | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/10-woocommerce-cart)       | [Broken](wordpress/case-10/broken/bug-clinic-shop/) → [Fixed](wordpress/case-10/fixed/bug-clinic-shop/)                 |
| 11 — SPA analytics              | [Read](react/cases/11-spa-analytics/README.md)          | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/11-spa-analytics/)     | [Tracker](react/src/analytics/tracker.ts) · [Route hook](react/src/analytics/use-page-views.ts)                         |
| 12 — Core Web Vitals            | [Read](react/cases/12-core-web-vitals/README.md)        | [Open](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/12-core-web-vitals/)   | [Shared landing page](react/src/performance/landing.tsx)                                                                |

WordPress/WooCommerce fixes in a child theme.

SPA analytics: route-aware GA4 page views, Consent Mode v2 and a local dataLayer inspector.

Performance: measured LCP, CLS and interaction repairs with mobile Lighthouse budgets.

Accessibility: targeted WCAG 2.2 repairs verified with keyboard contracts, axe-core checks and a manual NVDA pass.

## Run locally

Use Node.js 24.15 or later within the 24.x release line.

```sh
npm ci
npx playwright install chromium
npm start
```

Open http://127.0.0.1:4200. Hash routing supports direct case links and reloads on GitHub Pages without a backend or redirect workaround.

### React cases

The React cases share an independent Next.js static app with its own lockfile.

```sh
cd react
npm ci
npx playwright install chromium
npm run dev
```

Open http://127.0.0.1:3000/angular-bug-clinic/react/. For the production demo, run `npm run build` and `npm run preview`, then open http://127.0.0.1:4400/angular-bug-clinic/react/. Development Strict Mode performs an extra effect setup; the production preview shows the one-request invariant.

### Local Tasks API

Case 07 uses an in-browser mock on Pages. Its optional Express API runs only locally and in tests, sharing the same token module with the mock.

```sh
npm --prefix node ci
cd node && npm run dev
```

The API listens at http://127.0.0.1:4500 with `POST /login`, `POST /refresh` and `GET /tasks`. Open the local React case at `/angular-bug-clinic/react/cases/07-node-refresh-race/?api=local` to use it. Without that query parameter, the case uses the browser mock. No API is deployed.

Run the API checks with `npm --prefix node run format:check`, `npm --prefix node run lint`, `npm --prefix node test` and `npm --prefix node run build` from the repository root.

### WordPress case

Install the case dependencies, then open either shop:

```sh
npm --prefix wordpress/case-10 ci
npm run wp:broken
npm run wp:fixed
```

Use separate terminals for the last two commands. First preparation can take several minutes while the shop is initialized. The shops open at http://127.0.0.1:9410/shop/ and http://127.0.0.1:9411/shop/. WordPress Playground runs the same child themes locally and in the browser. The case page links two independent browser Playgrounds; allow about 20–30 seconds for startup, with longer first downloads possible.

Run `npm --prefix wordpress/case-10 run format:check`, `npm --prefix wordpress/case-10 run lint`, `npm --prefix wordpress/case-10 run lint:php` and `npm run wp:test` for the case checks.

## Verify

```sh
npm run format:check
npm run verify
npm run e2e:pages
```

CI runs formatting, ESLint, Vitest unit tests, Playwright browser tests and the production Pages build. It also serves that production build under /angular-bug-clinic/ and repeats browser tests to verify the base path. Only successful main CI runs can trigger the Pages deployment.

The desired behavior is tested against both versions. Broken is marked as an expected failure; an unexpected pass fails the suite. A separate passing test checks the specific visible bug so a random exception cannot be mistaken for proof. Fixed must satisfy the same invariant normally.

Run the React checks from `react/`:

```sh
npm run format:check
npm run lint
npm test
npm run build
npm run typecheck
npm run e2e
```

To preview navigation between both apps, run these commands from the repository root after installing both sets of dependencies:

```sh
npm run build:pages
npm --prefix react run build
node -e "require('node:fs').cpSync('react/out', 'dist/angular-bug-clinic/browser/react', {recursive: true})"
npm --prefix react run e2e:integration
node scripts/serve-pages.mjs
```

Open http://127.0.0.1:4300/angular-bug-clinic/ and follow the React case card.

The React CI job checks the static export separately. Pages combines both builds, placing the React app under `react/` and preserving the Angular hash routes.

## Stack

Angular 22.2 (standalone, signals, strict TypeScript, built-in control flow), RxJS, the Angular CLI default Vitest runner, angular-eslint, Prettier, Playwright and GitHub Actions. Ionic 9.0 is lazy loaded only by case 05. Versions are pinned by package-lock.json. Cases 06, 07, 09, 11 and 12 use Next.js 16.4, React 19.3, React Testing Library and Vitest with a separate lockfile. Case 07 adds a local Express 5 API and MSW browser interception.

## Portfolio material

Twenty-four [1600 × 1200 screenshots](docs/screenshots/) and twelve portfolio descriptions accompany the case write-ups. [Project overview](docs/OVERVIEW.md) · [Progress log](docs/LOG.md).

## License

[MIT](LICENSE). Maintained by [massimilianoborgatti](https://github.com/massimilianoborgatti).
