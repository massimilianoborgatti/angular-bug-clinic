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

## 2026-10-29 — Modal on small screens

- Anchored the case 05 modal to the viewport so document scrolling cannot move it off screen.
- Allowed modal content to scroll when a short viewport cannot fit all actions.
- Added browser coverage for both variants at 390 × 844, 320 × 568, and 844 × 320, including opening after document scrolling and reaching Close notes.

## 2026-10-30 — Case 06: React effect loop

- Added an independent Next.js static export with shared mock orders and matching Broken and Fixed views.
- Reproduced repeated requests and stale filter results, then repaired effect dependencies and ignored obsolete responses during cleanup.
- Verified eight unit contracts, including two expected Broken failures, and six static browser checks, including two expected Broken failures. Covered search, loading feedback, keyboard tabs, narrow screens, and Strict Mode cleanup.
- Added the home card, a separate React CI job, combined Pages output, and a browser check for navigation between both apps and all five Angular case URLs.
- Formatting, lint, type checking, both production builds, all 32 Angular unit contracts, and all 28 Angular browser checks on development and production passed locally.
- Added the write-up, two reviewed 1600 × 1200 screenshots, and the sixth portfolio description. Existing case implementations and screenshots are unchanged.
- Next: run remote CI and verify the published React route and existing case routes after integration.

## 2026-11-02 — Cases 08 and 09: Accessibility repairs

- Added a Contacts dialog comparing a hand-made overlay with a named native dialog, initial focus, Tab/Shift+Tab containment, Escape handling and trigger-focus restoration.
- Added a separate React sign-up route comparing visual-only errors with explicit labels, error descriptions, a focused summary, keyboard submission and a polite success region. Kept interactive targets at least 24 pixels in the repaired form.
- Added expected-failure contracts and explicit Broken symptom checks, plus axe-core scans of the open editor and invalid form. Fixed scans report no serious or critical findings in those scopes.
- Verified 42 Angular unit contracts, 35 development browser checks and 35 production-path browser checks; verified 16 React unit contracts, 12 static browser checks and combined-site navigation across existing and new routes. Both production builds, formatting, lint and type checking passed.
- Validated the React browser suite with two workers, matching CI. An earlier concurrent run encountered the existing case 06 clock initialization race; its source and tests are unchanged.
- Added two WCAG-mapped write-ups, four visually checked 1600 × 1200 screenshots and two portfolio entries. Both NVDA sections are marked to be verified; no manual screen-reader test has been performed.
- Next: complete the two manual NVDA checklists, then run remote CI and verify the published case URLs after integration.

## 2026-11-02 — Manual accessibility verification

- Manual NVDA checks completed for cases 08 and 09 on Windows in a desktop Chromium browser; write-ups updated.

## 2026-11-02 — Case 07: Rotating refresh tokens

- Added a local-only Express Tasks API with five-second access tokens, rotating refresh tokens and strict family revocation after reuse. Browser handlers import the same runtime-independent token module; only static assets are published.
- Added a shared React dashboard with a visible session log. Broken refreshes each expired request independently; Fixed shares one pending refresh, handles late 401 responses and retries once. Tokens stay in memory and are omitted from the log.
- Added API contracts for rotation, exact expiry, reuse, fresh sessions, invalid input and local-origin access. React contracts use MSW with an injected clock; browser checks wait for the actual token deadline and verify worker interception, keyboard operation and a narrow viewport.
- Validation passed: root formatting, lint, 42 unit contracts (9 expected Broken failures), 35 development browser checks, the Pages build and 35 production browser checks; React formatting, lint, 21 unit contracts (6 expected Broken failures), static build, type checking and 16 browser checks (5 expected Broken failures); Node formatting, lint, 6 API tests, type checking and build.
- Verified the combined static site across all nine case links and reloads. Separately exercised the React client against the actual local Express process: Broken issued three refresh requests and lost the session; Fixed issued one and loaded all three task lists.
- Added two visually checked 1600 × 1200 screenshots, a case write-up and a portfolio entry. Existing case implementations and their screenshots are unchanged. Added a separate Node CI job while retaining the existing jobs and deployment steps.
- Next: run remote CI and verify the published case URL after integration.

## 2026-11-02 — Case 09 page metadata

- Added a route layout with a dedicated form-errors title and description instead of inheriting the effect-loop metadata.
- Connected all three React cases (06, 07 and 09) in each page header and marked the current-page link. Header links wrap on small screens. Browser regressions check the title, description, reload, tab switching and navigation between all React cases at 360 pixels.
- Validation passed: root formatting; React formatting, lint, 21 unit contracts (6 expected Broken failures), production build, type checking, 18 browser checks (5 expected Broken failures) and combined static-site integration.

## 2026-11-03 — Case 10: WooCommerce cart fragments

- Added two original Storefront child themes for a successful AJAX addition with stale header feedback. Broken returns an absent fragment selector and watches the badge; Fixed shares header markup and selector construction, and releases pending feedback on success or failure events.
- Added independent Playground configurations with WordPress 7.1.4, WooCommerce 11.2.1, Storefront 4.6.2 and PHP 8.3. The fixture disables scheduled and asynchronous background work; cart requests remain real. One request worker avoids SQLite contention on Windows, and browser checks wait for an explicit signal after the complete shop configuration finishes. First local preparation can take several minutes.
- Added child-theme archive generation, a static case page with two Playground links, a library card and a separate 20-minute CI job with one browser-test retry. Only the small child-theme archives and configurations accompany the static app; no WordPress core or plugin copy is included.
- Validation passed: root formatting, lint, 42 unit contracts (9 expected Broken failures), 36 development browser checks, Pages build and 36 production browser checks; React formatting, lint, 21 unit contracts (6 expected Broken failures), static build, type checking, 18 browser checks and combined static-site integration; Node formatting, lint, 6 API tests, build and type checking.
- WordPress checks passed: JavaScript formatting and lint, PHP syntax parsing through Playground, 6 real-shop browser contracts (2 expected Broken failures), and 2 visually checked 1600 × 1200 captures. Fixed updates the first item's count and total, clears its spinner, accepts a second product and releases pending feedback after a failed request. Broken separately proves the successful addition and stale feedback before reloading.
- Added a 357-word write-up and a portfolio entry within its title and description limits. Existing case implementations and images are unchanged.
- Next: run remote CI and verify the published case page and its two Playground asset URLs after integration.
