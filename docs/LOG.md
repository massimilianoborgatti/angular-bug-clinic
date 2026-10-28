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
