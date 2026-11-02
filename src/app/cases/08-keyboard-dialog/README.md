<!-- NVDA: to be verified -->

# 08 — The dialog that keyboard users couldn't leave

## Symptom

The Contacts editor looks modal, but keyboard focus stays on the covered page. Escape does nothing, the icon cannot be reached as a button, and closing loses the return point.

## How to reproduce

Open the [case](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/08-keyboard-dialog). On Broken, Tab to Edit contact and press Enter. Tab again: Contact list help receives focus underneath the overlay. Try Escape, then close with Cancel. Repeat on Fixed, including Shift+Tab and the named close button.

## Root cause

A hand-made div supplies the visual overlay and declares aria-modal without a dialog role or name. It never transfers, contains or restores focus. Its clickable close div has neither keyboard activation nor button semantics.

## The fix

The [Fixed editor](fixed-dialog.ts) uses native dialog.showModal(), which makes the background inert. aria-labelledby names it from the heading. Initial focus goes to Name; explicit boundary handling cycles Tab and Shift+Tab inside the controls. Escape, Cancel, Save and Close restore the original trigger. Draft values are saved only by Save. Native dialog reduces the custom behavior needed; see [technique H102](https://www.w3.org/WAI/WCAG22/Techniques/html/H102).

## WCAG criteria

These repairs target [WCAG 2.2](https://www.w3.org/TR/WCAG22/): **2.1.1 Keyboard**, **2.4.3 Focus Order**, **4.1.2 Name, Role, Value**, and **2.4.11 Focus Not Obscured (Minimum)**. Keeping focus inside the visible editor avoids covering the active background control. **2.1.2 No Keyboard Trap** permits modal containment with an available exit: Escape and keyboard-operable close actions release it.

## How it's tested

TestBed runs the same entry, Escape, return-focus and naming contracts against both variants; Broken fails as expected. jsdom stubs only native dialog primitives. Playwright exercises actual modality, repeated Tab boundaries, Escape, a narrow viewport and axe-core. Separate Broken symptom checks identify the missing behavior and prohibited modal attribute. Scans target the open editor and serious/critical findings; they do not establish complete page conformance.

## Manual check with NVDA

**Pending; not run.** In a desktop Chromium browser with NVDA enabled, Tab to Edit contact, Enter, Tab through controls, Shift+Tab, then Escape. Fixed should announce the Edit contact dialog, Name edit field and named close button, then return to Edit contact. Broken should leave focus on the trigger, with no dialog announcement, and let Tab reach page content. Exact wording depends on settings.

## Takeaway

A visual layer needs an accessible keyboard entry and exit.
