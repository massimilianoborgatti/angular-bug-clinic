# 05 — Ionic hardware back button

**Symptom:** pressing back changes the task page underneath a modal while the notes remain open. The user loses their place before finishing the current interaction.

**How to reproduce:**

1. Open the [live case](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/05-ionic-back-button), select Broken, and choose **Open task notes**.
2. Press **Simulate hardware back** inside the modal. Its readout changes to Task list, but the modal stays open.
3. Select Fixed and repeat. The first press closes the notes and keeps Task details; the second press returns to Task list.

**Root cause:** a custom navigation handler registers at priority 101. Ionic's modal handler uses priority 100, so navigation wins and consumes the event. Only the winning handler runs unless it explicitly propagates. This example uses a real Ionic modal and an in-memory page stack so it stays self-contained.

**The fix:** lower custom navigation to priority 0. Ionic's overlay then gets the first press. Both versions release subscriptions on destruction; a route guard awaits modal dismissal before leaving. See the [case PR](https://github.com/massimilianoborgatti/angular-bug-clinic/pull/7).

**How it's tested:** one shared invariant runs against both components with a mocked Platform priority dispatcher: the first press must close the modal without navigation. Broken is an expected failure; Fixed passes. Browser tests also leave during presentation, navigate Back/Forward, and check overlay cleanup and mobile viewport bounds.

**Takeaway:** give overlays first refusal before handling navigation.

For a real-device check, run this page in an Android Ionic host with its normal hardware-back adapter. Open the notes and press the physical button twice: Fixed must close notes, then navigate. This browser-only repository requires no native packages or build. Its labelled simulator dispatches ionBackButton. Close Watcher is disabled so the demo does not install a persistent browser-back interceptor. Browser Back and ion-back-button are separate mechanisms.

[Ionic hardware-back documentation](https://ionicframework.com/docs/developing/hardware-back-button)
