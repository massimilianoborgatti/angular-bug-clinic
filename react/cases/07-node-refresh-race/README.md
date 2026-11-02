# 07 — Logged out at random

## Symptom

A Tasks dashboard loads normally after login, then loses its session when three task lists reload together. The event log shows competing refreshes and session revocation, even though the first refresh succeeded. The problem appears only after the short-lived access token expires.

## How to reproduce

Open the [demo](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/07-node-refresh-race/). On Broken, choose Log in to demo, wait five seconds, then Reload dashboard. Three requests receive 401 and each refreshes with the same token. The counter reaches three and the session ends. Repeat on Fixed: one refresh serves all three requests, the tasks return and the session remains active.

## Root cause

Refresh tokens rotate: each successful refresh invalidates its predecessor. Reusing that predecessor revokes the whole session, including newly issued access tokens. Broken treats each 401 independently instead of coordinating work belonging to one session. The server's reuse detection is correct; relaxing it would hide the client race.

## The fix

Compare [Broken](../../src/refresh/broken-refresh.ts) with [Fixed](../../src/refresh/fixed-refresh.ts). Fixed shares one pending promise, clears it after success or failure, and retries each request only once. A late 401 uses an already renewed access token without starting another refresh. Tokens remain in memory and never appear in the event log.

The local Express API and browser MSW handlers import the [same token module](../../../node/src/tokens.ts). Pages runs entirely in the browser. For a local API comparison, install dependencies in `node/`, run `npm run dev`, and append `?api=local` to the local case URL.

A short server grace window could tolerate overlap, but weakens immediate reuse detection. HTTP-only cookies reduce script access to tokens, but require appropriate CSRF protections and do not themselves serialize rotating refresh requests. This small demo is not a production authentication system.

## How it's tested

API tests cover rotation, exact expiry and family revocation. React tests use MSW with an injected clock; the same one-refresh contract fails as expected on Broken and passes on Fixed. Separate checks prove the actual reuse symptom and subsequent refresh cycles. Browser tests wait for the real token deadline, verify worker interception, reload three lists and check keyboard use on a narrow screen.

## Takeaway

Coordinate refresh at the session boundary, while keeping server-side reuse detection strict.
