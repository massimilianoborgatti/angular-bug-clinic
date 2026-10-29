# Build log

## 2026-10-28 — Setup

- Created the case library, five case routes, MIT license, and the shared demonstration layout.
- Generated the application with Angular CLI 22.2.5, Angular 22.2.3, and Node.js 24.22.1.
- Added ESLint, Prettier, the Angular CLI default Vitest runner, Playwright, and CI and Pages workflows.
- Selected hash routing so direct case links and reloads work on a static deployment.
- Checked the development server and the production build under the `/angular-bug-clinic/` base path.

## 2026-10-28 — Case 01: Subscription leak

- Added a notification widget whose Broken subscription survives destruction and a Fixed implementation using `takeUntilDestroyed`.
- Added the shared teardown invariant, explicit symptom checks, browser navigation coverage, the case write-up, two 1600 × 1200 screenshots, and a portfolio description.
- Local validation passed with six unit contracts and six browser checks on development and production paths.

## 2026-10-28 — Case 02: OnPush stale view

- Demonstrated a parent array mutation that leaves an OnPush child stale, then repaired it with an immutable update.
- Tested real parent button clicks and the child's rendered count and text, including repeated additions.
- Added the case write-up, two 1600 × 1200 screenshots, and a portfolio description.
- Local validation passed with ten unit contracts and ten browser checks on development and production paths.

## 2026-10-28 — Case 03: Async validator race

- Reproduced an older username response overwriting the current result through independent subscriptions.
- Added immediate cancellation with `switchMap`, a short debounce, pending feedback, and controlled mock delays.
- Used Vitest fake timers for the unit regression, matching the default runner, and a controlled browser clock for the full replay before browser assertions. This checks the final stale response rather than a temporary successful state.
- Added the case write-up, two 1600 × 1200 screenshots, and a portfolio description.
- Local validation passed with 14 unit contracts and 13 browser checks on development and production paths.

## 2026-10-28 — Case 04: Guard redirect loop

- Reproduced the guarded-login loop with real Router navigation and a bounded demonstration stop.
- Left Fixed login reachable, returned `UrlTree` redirects, and checked the return destination against the known task route.
- Added RouterTestingHarness coverage for one login redirect, returning after login, and unsafe return targets.
- Covered direct child navigation, reused parent routes, tab synchronization, and Back/Forward behavior in the browser.
- Added the case write-up, two 1600 × 1200 screenshots, and a portfolio description.

## 2026-10-28 — Case 05: Ionic back button

- Added a real Ionic modal and compared navigation-handler priorities above and below the overlay handler.
- Verified overlay-first behavior, second-press navigation, and handler teardown with priority-dispatch unit tests and browser checks.
- Kept Ionic Angular 9.0.10 in its lazy route and set an explicit size budget for its required core stylesheet.
- Added the case write-up, two 1600 × 1200 screenshots, and a portfolio description.

## 2026-10-29 — Full verification

- Formatting, lint, 32 unit contracts (27 passing and five expected failures), 25 browser checks on both development and production Pages paths, and the strict production build passed.
- Ten 1600 × 1200 screenshots were generated and visually reviewed.
- CI uses pinned action revisions. Deployment accepts successful main-branch push CI from the same repository.
- Setup and the five cases were integrated through separate pull requests, with CI and the published case routes checked in sequence.

## 2026-10-29 — Modal navigation cleanup

- Awaited Ionic modal dismissal in a route guard before destroying the view, including navigation during presentation.
- Added browser coverage for early and visible-modal exits, Back/Forward navigation, overlay removal, scroll unlock, and page errors.
- The route-exit regression passed ten repeated production-path checks and the full development and production suites.

## 2026-10-29 — Documentation

- Added the project overview and neutral contributor guidance, updated documentation links, and retained the technical progress history.
- Kept the five portfolio descriptions and ten screenshots alongside their case write-ups.
