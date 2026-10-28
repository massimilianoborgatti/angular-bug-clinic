# 03 — Async validator race condition

**Symptom:** A free username is marked unavailable. The input contains `freshname`, but the message was decided by an earlier request for `taken`.

**How to reproduce:**

1. Open the [live case](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/03-async-validator-race) and select **Broken**.
2. Click **Reproduce race**. The demonstration submits `taken`, then changes the value to `freshname`.
3. Wait for both mock responses. Compare **Current value** with **Response applied for**.
4. Select **Fixed** and repeat. The available message now belongs to the current input.

**Root cause:** The broken form starts an independent subscription inside every `valueChanges` callback. Each response calls `setErrors`, even when its username is no longer present. This is an out-of-band validation antipattern; a correctly returned Angular async-validator observable already participates in cancellation. Normal typing uses random artificial delays, so response order varies. The repeatable button assigns a slow response to the old value and a fast response to the new one.

**The fix:** A single `switchMap` chain cancels the previous request as soon as another value arrives. An 80 ms debounce sits inside that cancellable chain, and a visible pending message explains the wait. Both versions tear down their subscriptions when the page closes. See the [case PR](#case-03).

**How it's tested:** A shared unit assertion checks that the latest username owns the final errors and rendered message. It is an expected failure for Broken and passes for Fixed; a separate test confirms the exact stale-response symptom. The default Vitest runner uses controlled fake timers instead of Zone-based `fakeAsync`. Playwright repeats the same user journey in the browser.

**Takeaway:** A response must still belong to the current input before it can decide the user's next step.
