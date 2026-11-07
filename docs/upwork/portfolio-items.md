# Portfolio items

Portfolio copy for each case

## 01 — Subscription leak

**Title:** Angular bug fix: stop subscriptions surviving navigation

**Role:** Developer

**Description:** A notification widget kept listening after navigation, so each visit multiplied its work. I traced the extra handlers to a missing subscription teardown, tied the stream to Angular’s DestroyRef with takeUntilDestroyed, and proved the behavior with the same unit and browser tests against both versions. The fixed widget releases its listener as soon as it is destroyed.

**Skills:** Angular, TypeScript, RxJS, Unit Testing, Bug Fix

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/src/app/cases/01-subscription-leak)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/01-subscription-leak)

**Screenshots:** [Broken](../screenshots/01-broken.png) · [Fixed](../screenshots/01-fixed.png)

## 02 — OnPush stale view

**Title:** Angular bug fix: refresh an OnPush list correctly

**Role:** Developer

**Description:** A task list changed in memory while its OnPush child kept showing the old count. I isolated an in-place array mutation that preserved the input reference, replaced it with an immutable update, and checked the rendered child through real parent button clicks. Unit and browser tests demonstrate the stale Broken view and the correctly updated Fixed view.

**Skills:** Angular, TypeScript, Signals, Unit Testing, Bug Fix

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/src/app/cases/02-onpush-stale-view)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/02-onpush-stale-view)

**Screenshots:** [Broken](../screenshots/02-broken.png) · [Fixed](../screenshots/02-fixed.png)

## 03 — Async validator race

**Title:** Angular bug fix: prevent stale async validation results

**Role:** Developer

**Description:** A slow username check overwrote a newer answer and marked an available name as taken. I reproduced the request race with controlled mock delays, replaced nested subscriptions with a debounced switchMap pipeline, and displayed pending feedback. Deterministic unit and browser tests prove that only the current username can decide the result.

**Skills:** Angular, TypeScript, RxJS, Unit Testing, Bug Fix

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/src/app/cases/03-async-validator-race)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/03-async-validator-race)

**Screenshots:** [Broken](../screenshots/03-broken.png) · [Fixed](../screenshots/03-fixed.png)

## 04 — Guard redirect loop

**Title:** Angular bug fix: resolve an authentication redirect loop

**Role:** Developer

**Description:** A route guard redirected guests to a login page protected by the same guard. I reproduced the real Router loop with a safe attempt limit, left login unguarded, returned UrlTrees, and allowlisted the return destination. RouterTestingHarness and browser tests verify one login redirect, a successful return to the original task page, and rejection of unsafe return targets.

**Skills:** Angular, TypeScript, Unit Testing, Playwright, Bug Fix

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/src/app/cases/04-guard-redirect-loop)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/04-guard-redirect-loop)

**Screenshots:** [Broken](../screenshots/04-broken.png) · [Fixed](../screenshots/04-fixed.png)

## 05 — Ionic back button

**Title:** Ionic bug fix: close a modal before hardware Back navigates

**Role:** Developer

**Description:** A custom back-button handler navigated the page beneath an open Ionic modal. I traced the conflict to a handler running above the overlay priority, lowered navigation priority, and released the handler on destroy. Priority-dispatch unit tests and a real browser modal verify that the first back press closes notes and only the next press navigates.

**Skills:** Angular, TypeScript, Ionic Framework, Unit Testing, Bug Fix

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/src/app/cases/05-ionic-back-button)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/05-ionic-back-button)

**Screenshots:** [Broken](../screenshots/05-broken.png) · [Fixed](../screenshots/05-fixed.png)

## 06 — React effect loop

**Title:** React bug fix: stop a useEffect request loop and stale results

**Role:** Developer

**Description:** An orders page kept requesting data while idle, and fast filter changes showed stale results. I traced the loop to an object recreated in a useEffect dependency and the stale list to missing cleanup. Primitive dependencies stop repeated requests, while an ignore flag prevents obsolete responses from changing the view. Controlled unit and static-build browser tests demonstrate both bugs and prove the repair in a React and Next.js demo.

**Skills:** React, Next.js, TypeScript, Unit Testing, Bug Fix

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/react/)

**Screenshots:** [Broken](../screenshots/06-broken.png) · [Fixed](../screenshots/06-fixed.png)

## 07 — Refresh token race

**Title:** Node.js + React fix: stop random logouts from a token refresh race

**Role:** Developer

**Description:** A task dashboard logged users out when three expired requests refreshed the same rotating token. I traced the race across a Node.js/Express API and React client. Sharing one refresh promise stops token reuse while preserving strict server-side revocation. API tests cover rotation, expiry and reuse; React and browser tests show Broken losing its session and Fixed loading all three task lists with one refresh. The live demo uses the same token logic through an in-browser mock.

**Skills:** Node.js, React, TypeScript, Unit Testing, Bug Fix

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/07-node-refresh-race)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/07-node-refresh-race/)

**Screenshots:** [Broken](../screenshots/07-broken.png) · [Fixed](../screenshots/07-fixed.png)

## 08 — Keyboard-safe modal dialog

**Title:** Angular accessibility fix: keyboard-safe modal dialog (WCAG 2.2)

**Role:** Developer

**Description:** A contact editor kept keyboard focus behind an overlay and lost its return point. I mapped the defects to WCAG 2.2 Keyboard, Focus Order and Name, Role, Value, then used a named native dialog with initial focus, Tab containment and keyboard close actions. Unit contracts, keyboard browser tests and axe-core demonstrate Broken and verify Fixed. Verified manually with NVDA.

**Skills:** Web Accessibility, Accessibility Testing, Angular, TypeScript, Web Content Accessibility Guidelines

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/src/app/cases/08-keyboard-dialog)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/08-keyboard-dialog)

**Screenshots:** [Broken](../screenshots/08-broken.png) · [Fixed](../screenshots/08-fixed.png)

## 09 — Form errors and announcements

**Title:** React accessibility fix: form errors screen readers can hear

**Role:** Developer

**Description:** A sign-up form displayed red errors without accessible labels, descriptions or a useful focus destination. I mapped the failures to WCAG 2.2 relationships, error identification, labels and status messages. Explicit labels, linked errors, a focused summary and a polite success region repair the flow. Unit tests, keyboard browser checks and axe-core compare Broken with Fixed. Verified manually with NVDA.

**Skills:** Web Accessibility, Accessibility Testing, React, TypeScript, Web Content Accessibility Guidelines

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/09-form-errors)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/09-form-errors/)

**Screenshots:** [Broken](../screenshots/09-broken.png) · [Fixed](../screenshots/09-fixed.png)

## 10 — WooCommerce header cart fragments

**Title:** WooCommerce fix: header cart that only updated after a reload

**Role:** Developer

**Description:** A shop added products successfully, but its custom header count stayed at zero and a spinner never stopped. I traced both symptoms to a child theme's mismatched cart-fragment selector and DOM-dependent feedback. Shared header markup and a matching selector restore the cart count and total; request events release the spinner on success or failure. Browser tests compare Broken and Fixed using real WooCommerce in WordPress Playground.

**Skills:** WordPress, WooCommerce, PHP, JavaScript, Bug Fix

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/blob/main/docs/cases/10-woocommerce-cart.md)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/10-woocommerce-cart)

**Screenshots:** [Broken](../screenshots/10-broken.png) · [Fixed](../screenshots/10-fixed.png)

## 11 — SPA page views and consent

**Title:** Analytics fix: GA4 page views and consent in a React/Next.js app

**Role:** Developer

**Description:** A React shop counted its first page twice, missed client navigation and recorded events before consent. I traced the overlap between automatic config tracking and a mount-only layout effect. A route-aware hook observes pathname and query changes, disables the automatic view and gates events behind Consent Mode v2 signals. Unit and static-build browser tests compare Broken with Fixed, including wishlist parameters. A local dataLayer inspector makes every command visible without real tracking services.

**Skills:** Google Analytics, Google Tag Manager, React, Next.js, JavaScript

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/11-spa-analytics)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/11-spa-analytics/)

**Screenshots:** [Broken](../screenshots/11-broken.png) · [Fixed](../screenshots/11-fixed.png)

## 12 — Core Web Vitals on a landing page

**Title:** Speed fix: Core Web Vitals on a Next.js landing page

**Role:** Developer

**Description:** A landing page loaded its artwork late, shifted under a notice and paused when changing billing. I traced oversized images, missing reserved space and repeated locale formatting. Priority WebP, a preloaded swap font, stable dimensions, an overlay notice and memoized pricing repair the flow. Three-run mobile Lighthouse medians check LCP, CLS and TBT budgets; browser tests compare Broken with Fixed and verify a toggle response below 100 ms. A local panel reports real browser Web Vitals.

**Skills:** Web Performance, Next.js, React, Core Web Vitals, JavaScript

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/12-core-web-vitals)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/12-core-web-vitals/)

**Screenshots:** [Broken](../screenshots/12-broken.png) · [Fixed](../screenshots/12-fixed.png)

## 13 — Responsive design to code

**Title:** Design to code: a responsive, accessible React landing page

**Role:** Developer

**Description:** A studio landing page overflowed on phones, overlapped its hero and left keyboard controls inactive. I traced rigid widths, absolute positioning, copied colours and div-based interactions. A token-driven grid, fluid type, native buttons and disclosures restore the design and its behavior. Playwright checks four widths, keyboard operation, target sizes, axe findings and visual agreement with two original desktop/mobile mockups. Broken proves the symptoms; Fixed passes the same contracts.

**Skills:** HTML5, CSS, Responsive Design, React, Web Accessibility

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/13-design-to-code)

**Live demo:** [Try Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/13-design-to-code/)

**Screenshots:** [Broken](../screenshots/13-broken.png) · [Fixed](../screenshots/13-fixed.png)

## 14 — Sample code review report

**Title:** Sample code review: security and quality in an AI-built Next.js app

**Role:** Developer

**Description:** Reviewed a fictional notes app with cross-team access, active saved markup and unvalidated requests. I traced ownership checks, rendering and input boundaries, then documented nine findings with source lines, severity, effort and real repair diffs. A fixed copy and paired unit/browser tests prove the main repairs; separate checks establish the Broken symptoms. The owner summary, full web report and PDF explain priorities and limits in plain English. The sample app runs only locally.

**Skills:** Code Review, React, Next.js, TypeScript, Web Application Security

**Write-up:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/14-code-review-sample)

**Live demo:** [Read the report and compare evidence](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/14-code-review-sample/)

**Full report:** [Read online](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/14-code-review-sample/report/) · [PDF](https://massimilianoborgatti.github.io/angular-bug-clinic/react/case-14/code-review-sample.pdf)

**Screenshots:** [Broken](../screenshots/14-broken.png) · [Fixed](../screenshots/14-fixed.png)

## 15 — Elementor mobile layout fixes

**Status:** Prepared for Massimiliano to save on Upwork after checking the live links.

**Title:** Elementor Free: mobile layout fixes

**Role:** Developer (mobile layout practice)

**Description:** I used a fictional WordPress practice site to reproduce and fix two mobile layout issues in Elementor Free. I adjusted the hero copy to fit the screen and stacked the three service cards on mobile. The linked case study shows the reference comparison at 390 px.

**Skills:** WordPress, Elementor, Responsive Design, CSS, Bug Fix (confirm the available labels before saving).

**Images:**

1. [Broken](../screenshots/15-broken.png): The hero and desktop menu overflow a 390 px viewport.
2. [Fixed](../screenshots/15-fixed.png): The headline wraps and a compact menu fits the same viewport.

**Case study URL after deployment:** [Compare Broken and Fixed](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/15-elementor-mobile-layout/)

**Write-up URL after merge:** [Read the case](https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/15-elementor-mobile-layout)
