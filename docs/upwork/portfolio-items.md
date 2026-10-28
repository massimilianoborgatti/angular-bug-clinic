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
