# Upwork portfolio items

Publish-ready copy for the owner to use manually. Every example uses original, neutral mock data.

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
