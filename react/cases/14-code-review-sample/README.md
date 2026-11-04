# 14 — Sample code review: Northwind Notes

## Symptom

A fictional notes app appears usable, but a Blue team member can read a Red team note. Saved markup becomes active page content, and the create operation accepts empty values and caller-supplied ownership. Search and feedback conceal further quality problems. The sample illustrates patterns found in a small AI-built app; no real accounts or credentials are involved.

## How to reproduce

Open the [case page](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/14-code-review-sample/) to compare recorded Broken and Fixed evidence. Read the full report or its PDF for nine findings and focused reproductions. The public page does not execute the sample. Run the separate [local app](../../../samples/ai-built-review/README.md), open Broken and select `red-note`; compare Fixed using the same displayed demo identity.

## Root cause

The baseline treats a note ID as sufficient authority, inserts saved text through an HTML sink and trusts a TypeScript cast instead of validating JSON. Uncancelled requests, a captured initial draft and two inconsistent filters produce additional visible failures. The original runtime snapshot has no regression cases.

## The fix

The [paired implementation](../../../samples/ai-built-review/) preserves the same data and view. Fixed checks trusted team membership on reads and search, derives ownership internally, validates allowed fields and bounds, and renders plain text. It also cancels obsolete search work, debounces edits, reports failures, refreshes the draft snapshot and removes the extra filter and unused placeholder key.

The [report](../../../docs/samples/code-review-sample.md) provides owner priorities, scope, severity, effort estimates, exact source locations, real diff excerpts, positive notes and a repair plan. One Markdown source supplies the web report and [PDF](../../public/case-14/code-review-sample.pdf). Its fingerprint detects stale exports. The fixed identity is still a local fixture; it does not provide real sign-in or persistent data.

## How it's tested

Eighteen unit and eighteen browser contracts cover the local sample. Broken fails the three core unit contracts and seven browser contracts as expected. Separate passing assertions confirm cross-team disclosure, active markup, accepted ownership overrides and the asynchronous symptoms. Fixed passes the same contracts, including malformed JSON, rejected fields and a keyboard-operated team link at 375 pixels. Static-site tests verify the report content, PDF and absence of a deployed sample API.

## Takeaway

A useful review connects each observation to a reproducible symptom, a focused repair and evidence that the repair works.
