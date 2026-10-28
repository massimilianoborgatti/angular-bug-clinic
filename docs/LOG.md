# Build log

## 2026-10-28 — Setup

- Read the supplied specification and copied it to docs/SPEC.md.
- Public profile API check: company, bio, location and public email fields are empty; no employer is named in those fields.
- Verified GitHub account ID 82892095 and selected its no-reply commit email.
- Generated Angular CLI 22.2.5 / Angular 22.2.3 with Node 24.22.1; created routes, the case library, MIT license, lint, Vitest, Playwright and CI / Pages workflows.
- Hash routing preserves direct case URLs on static Pages hosting.
- Local validation and remote setup are in progress. No merge, deployment or portfolio publication is claimed yet.
- Next: complete setup PR, then integrate cases 01 to 05 in order, verifying CI and Pages after each merge.

## 2026-10-28 — Case 01: Subscription leak

- Added original Broken / Fixed examples, the shared expected-failure invariant, passing symptom checks, the case write-up, and portfolio copy.
- Local validation passed: lint, 6 unit contracts (including the expected Broken failure), 6 browser tests on both dev and production Pages paths. Two 1600 × 1200 screenshots were generated and visually reviewed. Remote CI, merge and live deployment remain unverified.
- Next: finish local checks, then publish the case PR after its predecessor is merged and verified.

## 2026-10-28 — Case 02: OnPush stale view

- Added original Broken / Fixed examples, the shared expected-failure invariant, passing symptom checks, the case write-up, and portfolio copy.
- Local validation passed: lint, 10 unit contracts (including two expected Broken failures), 10 browser tests on dev and production Pages paths, and the production build. Both 1600 × 1200 screenshots were visually reviewed. Remote CI, merge and live deployment remain unverified.
- Next: finish local checks, then publish the case PR after its predecessor is merged and verified.

## 2026-10-28 — Case 03: Async validator race

- Added original Broken / Fixed examples, the shared expected-failure invariant, passing symptom checks, the case write-up, and portfolio copy.
- Local validation passed: lint, 14 unit contracts (including three expected Broken failures), 13 browser tests on dev and production Pages paths, and the production build. Both 1600 × 1200 screenshots were visually reviewed. Controlled Vitest timers replace Zone-based fakeAsync, matching the Angular CLI default runner. Remote CI, merge and live deployment remain unverified.
- Next: finish local checks, then publish the case PR after its predecessor is merged and verified.

## 2026-10-28 — Case 04: Guard redirect loop

- Added original Broken / Fixed examples, the shared expected-failure invariant, passing symptom checks, the case write-up, and portfolio copy.
- Local validation passed: lint, 25 unit contracts (including four expected Broken failures), 20 browser tests on dev and production Pages paths, and the production build. Both 1600 × 1200 screenshots were visually reviewed. A direct-login test caught and fixed the initial demo-session variant before authentication. Remote CI, merge and live deployment remain unverified.
- Next: finish local checks, then publish the case PR after its predecessor is merged and verified.

## 2026-10-28 — Case 05: Ionic back button

- Added original Broken / Fixed examples, the shared expected-failure invariant, passing symptom checks, the case write-up, and portfolio copy.
- Local validation passed: lint, 32 unit contracts (including five expected Broken failures), 23 browser tests on dev and production Pages paths, and the strict production build. Both 1600 × 1200 screenshots were visually reviewed. Ionic stays in its lazy route; its required 12.4 kB core stylesheet uses a 14/16 kB per-style warning/error budget. Remote CI, merge and live deployment remain unverified.
- Next: finish local checks, then publish the case PR after its predecessor is merged and verified.

## 2026-10-28 — Final local verification

- All five cases are implemented. Formatting, lint, 32 unit contracts (27 passing, five expected failures), 25 browser checks on both dev and production Pages paths, and the strict production build pass.
- The final review added route/tab synchronization for reused case 04 parents, with hash navigation and Back/Forward regressions. Ten 1600 x 1200 portfolio screenshots are available.
- The setup branch also passed its own strict lint, unit, browser and Pages checks. Official CI actions are pinned to verified current release commits; deployment accepts successful same-repository main push CI only.
- All local commit authors and committers use the verified GitHub no-reply email. No remote is configured and no public repository, PR, remote CI result, merge, Pages deployment or Upwork publication is claimed.
- GitHub is connected in the app. GitHub CLI device login was not completed before its code expired; a fresh login with workflow permission is the next dependency for repository creation and pushing local commits.
- Local dependencies were propagated with history-preserving merge commits. No history rewrite or cleanup deletion was performed.
- Next: authenticate the CLI, create the public MIT repository, publish the setup PR, then publish cases 01 to 05 one at a time. Merge only after green CI and verify live Pages after each merge. Notify the owner after 01 and 02 are live. Synced Drive files remain untouched.
