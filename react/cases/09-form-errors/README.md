# 09 — The form errors nobody heard

## Symptom

A newsletter form displays red errors after submission, but its controls have no explicit labels or error descriptions. Focus remains on a div masquerading as a submit button, and successful submission has no live announcement.

## How to reproduce

Open the [case](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/09-form-errors/). On Broken, submit the empty form with the pointer and inspect the red messages. Tab to Subscribe and try Enter: it does not submit. On Fixed, submit with the keyboard, follow each summary link, correct the fields and submit again.

## Root cause

Placeholders replace labels; red styling creates no programmatic relationships. The div lacks button behavior, and completion has no accessible notification.

## The fix

The [shared form](../../src/signup-form.tsx) keeps data and validation identical. Fixed adds explicit labels and textual required instructions, a submit button, aria-invalid and aria-describedby for errors. Every error begins with Error:. Failed submission focuses a named summary with links that focus the corresponding fields. A persistent polite status region announces success.

## WCAG criteria

The targeted [WCAG 2.2](https://www.w3.org/TR/WCAG22/) criteria are **1.3.1 Info and Relationships** for labels and descriptions; **1.4.1 Use of Color** for textual error cues; **3.3.1 Error Identification** for specific messages; **3.3.2 Labels or Instructions** for field names and requirements; **4.1.2 Name, Role, Value** for controls and invalid state; and **4.1.3 Status Messages** for completion feedback. A focused summary additionally helps visitors find and repair errors.

## How it's tested

The same label, error-focus and success contracts fail as expected on Broken and pass on Fixed. Other tests check summary links and repeated submissions. Playwright checks keyboard recovery and descriptions at 360 pixels. axe-core scans each invalid form: Fixed has no serious/critical findings; an explicit Broken check confirms an unlabeled checkbox. These scoped scans are not certification.

## Manual check with NVDA

Verified manually with NVDA on Windows in a desktop Chromium browser (November 2026). Submitting empty fields with Tab and Enter in Fixed announces the summary heading and three error links. Following the Email link announces the required field, invalid state and error description. Completing the form announces success. Broken announces placeholders, an unnamed checkbox and plain Subscribe text without linked errors or keyboard activation. Exact wording depends on settings.

## Takeaway

An error needs a name, a relationship and a useful focus destination.
