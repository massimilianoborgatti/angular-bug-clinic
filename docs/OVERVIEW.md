# Angular Bug Clinic overview

A collection of real-world Angular, Ionic and React bugs, each with a broken version, a fix, a test that proves the fix, and a short write-up.

The examples use a small tasks and notifications application with in-memory mock data. Each case presents one visible symptom and one focused repair, so the behavior and its cause can be explored in about two minutes.

## How a case works

Open a case and use the **Broken** and **Fixed** tabs to compare the two implementations. The hint above the demonstration explains which action reveals the difference. Shared templates, mock services, and data keep the examples comparable; the implementation changes only where the repair needs it.

Every case includes a regression test for the desired behavior. The same invariant runs against both implementations. Broken is an expected failure, and an unexpected pass fails the test suite. A separate passing test checks the exact broken symptom, so an unrelated exception cannot count as proof. Fixed must satisfy the invariant normally.

The case README explains the symptom, gives a short reproduction, identifies the root cause, describes the fix, links to the relevant change, and explains how it is tested. It ends with a takeaway that applies beyond the example.

## The thirteen cases

<!-- prettier-ignore -->
1. [Subscription leak](../src/app/cases/01-subscription-leak/README.md): leaving and reopening a notification widget multiplies its listeners → tie the subscription to component destruction with `takeUntilDestroyed`.
2. [OnPush stale view](../src/app/cases/02-onpush-stale-view/README.md): a parent changes a task array but the child keeps the old count → replace the array instead of mutating it in place.
3. [Async validator race](../src/app/cases/03-async-validator-race/README.md): an old username response overwrites a newer result → cancel obsolete work with a debounced `switchMap` chain and show pending feedback.
4. [Guard redirect loop](../src/app/cases/04-guard-redirect-loop/README.md): a guest is redirected to a login route protected by the same guard → leave login reachable, return a `UrlTree`, and check the return destination.
5. [Ionic back button](../src/app/cases/05-ionic-back-button/README.md): a back handler moves the page underneath an open modal → respect overlay priorities and release the navigation handler on destruction.
6. [React effect loop](../react/README.md): an unstable effect dependency repeats requests and obsolete responses replace current results → use primitive dependencies and ignore stale responses during cleanup.
7. [Refresh token race](../react/cases/07-node-refresh-race/README.md): parallel expired requests revoke a rotating-token session → share one refresh promise and retry once.
8. [Keyboard-safe dialog](../src/app/cases/08-keyboard-dialog/README.md): an overlay loses keyboard entry and exit → use a named native dialog and restore focus.
9. [Accessible form errors](../react/cases/09-form-errors/README.md): visual errors lack names and relationships → add labels, error descriptions, a focused summary and live completion feedback.
10. [WooCommerce cart fragments](cases/10-woocommerce-cart.md): a successful cart addition leaves stale header feedback → match the fragment selector and finish pending feedback on request events.
11. [SPA analytics](../react/cases/11-spa-analytics/README.md): duplicate initial views and missed client navigation ignore consent → gate one route-aware event path behind consent and disable the automatic view.
12. [Core Web Vitals](../react/cases/12-core-web-vitals/README.md): late images, moving content and repeated computation slow a landing page → prioritize optimized artwork, reserve space and reuse pricing projections.
13. [Design to code](../react/cases/13-design-to-code/README.md): a rigid landing page overflows and excludes keyboard interaction → follow original mockups with fluid token-driven layouts and native controls.

## Stack and tooling

Angular **22.2.3**, generated with Angular CLI **22.2.5**, uses standalone components, signals, strict TypeScript, and built-in control flow. RxJS supplies the mock streams and cancellation examples. Ionic Angular **9.0.10** is loaded only by case 05. Exact dependency versions are recorded in `package-lock.json`.

Vitest is the Angular CLI default unit-test runner. Playwright checks the browser behavior against both the development server and the production Pages build. Controlled clocks make delayed-response regressions repeatable. ESLint and Prettier keep the source consistent.

GitHub Actions runs formatting, lint, unit tests, browser tests, and the production build. A successful main-branch CI run enables deployment to GitHub Pages. Hash routing keeps direct case links and reloads working on a static deployment without server-side route handling; the build also sets the `/angular-bug-clinic/` base path.

Case 06 runs independently in `react/` using Next.js static export, React, Vitest and React Testing Library. Its own CI job checks the build at `/angular-bug-clinic/react/`; Pages publishes both apps together.

Case 07 adds an optional local Express API in `node/`. Its pure token module is shared with MSW browser handlers; the published demo needs no deployed API. A separate CI job checks the API, and the React suite checks the client and browser mock.

Case 10 uses a Storefront child theme with WooCommerce inside WordPress Playground. Separate browser configurations load Broken or Fixed. The same configurations run locally through the Playground CLI for browser checks.

## Run and verify

Use Node.js 24.15 or later in the 24.x release line. Follow the [root README](../README.md#run-locally) to install dependencies, install the Playwright browser, and start the app. The [verification commands](../README.md#verify) check formatting, the full local suite, and the production base path.

[Open the live demo](https://massimilianoborgatti.github.io/angular-bug-clinic/) · [Read the progress log](LOG.md)
