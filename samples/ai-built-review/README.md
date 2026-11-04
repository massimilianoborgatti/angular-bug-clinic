Fictional app, sample report. Not a security certification or penetration test

# Northwind Notes - local code sample

A deliberately flawed notes app accompanies the [sample report](../../docs/samples/code-review-sample.md). Broken and Fixed use the same in-memory records, view and API boundary. The fixed demo identity belongs to Blue team only; it is a trusted fixture for testing authorization, not a production sign-in system. Team-only links select a note and never grant access themselves.

Only the report is published with the case library. This app runs locally and during its own checks; it is excluded from the Pages build. Records reset when the process restarts. The visible connection marker in Broken is an obvious placeholder, not a credential.

## Run

From this folder, with Node.js 24:

```sh
npm ci
npx playwright install chromium
npm run build
npm start
```

Open http://127.0.0.1:4600/broken/ or http://127.0.0.1:4600/fixed/. Use Open note by ID with `red-note` to compare authorization. Create a plain-text note and follow its team-only link. See the report for the remaining reproductions and their limits.

## Check

```sh
npm run format:check
npm run lint
npm test
npm run build
npm run typecheck
npm run e2e
npm audit --omit=dev
```

The companion regression suite lives in `fixed/tests/`, with Broken as a negative control. Desired authorization, escaping and validation contracts fail as expected on Broken and pass on Fixed. Separate assertions establish each Broken symptom. Browser checks additionally cover controlled search response order, the draft snapshot, failure feedback, case-insensitive search and a keyboard-operated team link at 375 pixels. The original Broken copy intentionally has no adjacent regression suite.
