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

## 2026-11-04 — Case 11: SPA analytics

- Added Demo Plant Shop with three real Next.js routes, query-driven pot colors, a persistent layout, consent controls and an in-memory gtag/dataLayer inspector. No Google scripts, cookies, real tracking identifiers or tracking requests are used.
- Broken duplicates the initial view through config and a mount-only effect, ignores navigation and sends events before consent. Fixed defaults all four Consent Mode v2 signals to denied, disables automatic views and uses one pathname/search hook after acceptance. Rejection leaves only consent signals; wishlist events use GA4 item parameters.
- Connected the eleventh library card and React navigation. New links disable prefetch to avoid platform-dependent segment requests in the static export. The combined-site check waits for the initial case 06 effect before selecting Fixed; it checks all eleven case URLs and reloads without page or asset errors.
- Validation passed: root formatting, lint, 42 unit contracts (9 expected Broken failures), 36 development browser checks, Pages build and 36 production browser checks (6 expected Broken failures per browser suite); React formatting, lint, 30 unit contracts (9 expected Broken failures), static build, type checking, 25 browser checks (7 expected Broken failures) and combined-site integration.
- Case 11 contributes 9 unit contracts (3 expected Broken failures) and 7 browser checks (2 expected Broken failures). Checks cover consent order, delayed acceptance, rejection, query changes, full locations, titles, duplicate prevention, Strict Mode, Back, wishlist parameters, keyboard tabs, narrow layout and absence of external requests.
- Node formatting, lint, 6 tests, type checking and build passed. WordPress formatting, lint, PHP syntax parsing and 6 browser checks (2 expected Broken failures) passed; an interrupted upstream plugin download required one repeat.
- Added two visually checked 1600 × 1200 screenshots, a 391-word write-up and a portfolio entry within its title, description and skill limits. Existing case implementations and images are unchanged.
- Next: run remote CI and verify the published analytics page after integration.

## 2026-11-04 — Case 12: Core Web Vitals

- Added a fictional Northwind Notes landing page with matching Broken and Fixed content. Broken discovers a textured 785,801-byte lossless background after hydration, blocks text on its font, reserves no artwork space, inserts a notice into document flow and reconstructs locale formatters for 4,000 estimates on every toggle.
- Fixed uses priority next/image with a static WebP loader, sizes, dimensions and high fetch priority. Local font preloading and swap keep text available; image reservations and an overlay avoid shifts. A shared formatter and memoized visible pricing projections remove redundant work. Each implementation tab loads a fresh document so browser metrics belong to one visit.
- Added a local web-vitals panel, an original reproducible illustration and a licensed local font. Browser measurements are distinct from lab measurements, and nothing is transmitted. Two visually checked 1600 × 1200 captures show identical settled content and measured before/after responses.
- Added a separate mobile Lighthouse CI job. The static measurement fixture uses gzip transfer and three fresh Chromium instances per variant with the default mobile simulated Slow 4G and 4x CPU settings. Median Broken/Fixed results: LCP 2.377/1.806 seconds, CLS 0.092/0.000, TBT 569/146 milliseconds and Performance score 81/98. All Fixed budgets pass; Broken fails the TBT budget as expected. No budget relaxation or Fixed-only exception was used.
- Playwright checks image reservations and next-frame toggle response below 100 milliseconds against both versions with 4x CPU throttling, plus explicit Broken symptoms, actual browser vitals and a 390-pixel layout. All 6 new browser checks passed, including 2 expected Broken failures.
- Validation passed: root formatting, lint, 42 unit contracts (9 expected Broken failures), 36 development browser checks, Pages build and 36 production checks (6 expected Broken failures per browser suite); React formatting, lint, 30 unit contracts (9 expected Broken failures), static build, type checking, 31 browser checks (9 expected Broken failures), two captures and combined-site navigation across all twelve cases.
- Added a 397-word write-up with measured lab medians, a portfolio entry within its limits, and discovery links. The asset-generation dependency is pinned to sharp 0.35.5; no forced dependency updates were used.
- Next: confirm the mobile budgets in remote CI and verify the published landing page after integration.

## 2026-11-04 — Case 12 load and layout regressions

- Expanded the legacy pricing export to format five billing columns for every estimate before choosing one displayed value. Broken now discovers a 952,109-byte background after that initialization; its URL is absent from the initial HTML. A native image-load event tracks background completion after JS discovers that URL.
- Broken inserts its large notice before the main content after the artwork paints. This visibly moves the complete page. Fixed retains reserved image space, an overlay notice and memoized visible prices.
- Strengthened the three-run mobile median contract: Broken must exceed LCP 4 seconds, CLS 0.25 and TBT 500 milliseconds together. Fixed still requires LCP below 2.5 seconds, CLS below 0.1 and TBT below 200 milliseconds. The default simulated mobile Slow 4G and 4x CPU profile is unchanged.
- Measured Broken/Fixed medians: LCP 6.909/2.170 seconds, CLS 0.458/0.000, TBT 2719/140 milliseconds, Performance score 27/97. All three Broken regressions are expected; all Fixed budgets pass.
- Added a clearly labeled recorded-results panel sourced from the measurement command's compact JSON snapshot. The separate live Browser Web Vitals panel continues to report the current visit, without substituting lab values for live measurements.
- Updated the 397-word write-up and retook both 1600 × 1200 light-theme screenshots at scroll position zero. Screenshot contracts require the complete header and three failing/passing recorded metric states to be visible.
- Validation passed: React formatting, lint, 30 unit contracts (9 expected Broken failures), static build, type checking, 31 browser checks (9 expected Broken failures), both screenshot checks and combined-site integration across all twelve cases. The six case 12 browser contracts include two expected Broken failures; native image completion also works under the 4x CPU interaction profile.
