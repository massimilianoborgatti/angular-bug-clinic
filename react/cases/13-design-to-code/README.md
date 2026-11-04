# 13 — The design that broke on phones

## Symptom

Example Studio looks plausible at first glance, but its landing page scrolls sideways on a phone. The hero heading covers the illustration on a tablet. The FAQ responds to clicks, while Enter does nothing. Pale body text and an unnamed, tiny icon link add barriers that a desktop screenshot alone cannot reveal.

## How to reproduce

Open the [case](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/13-design-to-code/) and select Broken. Resize to 375 pixels, then 768 pixels. Tab to a FAQ question and press Enter. Compare Fixed at the same widths, open and close a question with Enter or Space, and activate an enquiry button. The enquiry only updates local feedback; no message is sent.

## Root cause

The rushed implementation freezes the container at 1120 pixels and positions the hero artwork over a wide text column. Copied colour values drift from the handoff. Focusable divs provide pointer behavior without button semantics or keyboard activation. An SVG contributes no accessible link name, and its 16-pixel box is too small.

## The fix

The [shared content](../../src/design/studio.tsx) keeps both versions comparable. Fixed maps [design tokens](design-tokens.json) to CSS custom properties. Grid, flexible columns and clamped type adapt the composition without clipping content. Native buttons and details/summary supply keyboard activation and disclosure state. Text contrast, a named 44-pixel icon link and visible focus complete the targeted repairs.

The original [HTML/CSS reference](../../public/case-13/reference.html) is independent of the React implementation. Its frozen [1440-pixel](../../../docs/screenshots/13-reference-1440.png) and [375-pixel](../../../docs/screenshots/13-reference-375.png) mockups were captured before implementation; the browser comparisons never replace them automatically. Local fonts include their license.

## How it's tested

The same Playwright contracts run against both versions: layout at 320, 375, 768 and 1280 pixels; keyboard FAQ and enquiry activation; icon name and target size; and zero serious/critical axe findings. Fixed also matches both full-height reference images within a 2% pixel allowance. Broken fails these contracts as expected. Separate assertions prove its actual overflow, overlap, pointer behavior, contrast and unnamed link. All Fixed interactive targets are at least 24×24 pixels at 320 pixels. Automated checks are scoped evidence, not a complete accessibility assessment.

## Takeaway

A faithful build preserves the composition and the interaction. Check small screens and real controls alongside the pixels.
