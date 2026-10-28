# 01 — Subscription leak

**Symptom:** A notification widget appears to work, but every visit leaves another listener behind. One new notification eventually triggers several handler calls, including calls from widgets that are no longer visible.

**How to reproduce:**

1. Open the [live demonstration](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/01-subscription-leak) and select Broken.
2. Click Navigate away, then Return to widget. Repeat three times.
3. Click Emit notification. There are four active subscriptions and four log entries for one notification.
4. Select Fixed and repeat. Only the currently mounted widget handles the notification.

**Root cause:** Removing an Angular component does not automatically unsubscribe every manually created RxJS subscription. The shared notification feed outlives each widget, so its subscriber still retains the destroyed widget and invokes its callback. Repeated visits accumulate redundant work. The navigation controls really destroy and recreate the widget; they do not simply hide it.

**The fix:** The [case pull request](https://github.com/massimilianoborgatti/angular-bug-clinic/pull/2) adds `takeUntilDestroyed` with an injected `DestroyRef`. The subscription now ends with its component. An async pipe or `toSignal` is also useful when the template consumes the stream directly. The outer demonstration disposes the entire feed when leaving the case or changing tabs, keeping the intentional bug contained.

**How it's tested:** The same unit contract initializes a widget, destroys it, emits again, and requires the handler count to remain unchanged. Broken is an executed expected failure; Fixed passes. Separate characterization tests verify the retained listeners and their cleanup. Playwright repeats three visits and counts real console messages.

**Takeaway:** Give every long-lived subscription an explicit owner and release it when that owner disappears.
