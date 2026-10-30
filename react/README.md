# Case 06 — The effect that never stopped

## Symptom

An Orders page looks correct after loading, but its request counter keeps climbing while nobody touches it. Switching from Open to Shipped can briefly show shipped orders, then replace them with open orders even though Shipped remains selected.

## How to reproduce

Open the [demo](https://massimilianoborgatti.github.io/angular-bug-clinic/react/) on Broken. Watch the counter, then select Open and immediately select Shipped. Mock requests take a random 100–900 ms; repeat if Open finishes first. Compare the same actions on Fixed. Search narrows the list by order title.

## Root cause

Broken creates a new params object on every render and uses that object as an effect dependency. A response updates state, triggering another render and request. Missing cleanup also lets an older response replace newer results. The counter subscribes in a separate child, so measurement does not cause the loop.

## The fix

Fixed depends on primitive status and search values. Its cleanup marks obsolete responses as ignored, including after unmount. Loading feedback follows the current selection. The shared mock and view stay identical. Compare [Broken](src/broken-orders.tsx) with [Fixed](src/fixed-orders.tsx).

## How it's tested

Vitest and React Testing Library control timers and response order. The same two invariants fail as expected on Broken and pass on Fixed; separate tests prove both specific symptoms. Playwright repeats them against the static export, including three idle seconds and a slow Open response arriving last. Additional checks cover search, narrow screens, keyboard tabs, and Strict Mode cleanup. Development Strict Mode starts two initial requests; the production count is one.

## Takeaway

Stabilize dependencies and invalidate obsolete work together. For a larger application, consider TanStack Query or SWR for caching and request coordination.
