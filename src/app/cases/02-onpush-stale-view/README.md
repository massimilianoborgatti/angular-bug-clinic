# 02 — OnPush stale view

**Symptom:** Clicking Add task changes the parent's task count, but the list below still shows the original two tasks. The data exists in memory; the child simply has not rendered it.

**How to reproduce:**

1. Open the [live demonstration](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/02-onpush-stale-view) and select Broken.
2. Click Add task. Compare Parent · actual array length with OnPush child · rendered tasks.
3. Select Fixed and click Add task again. Both counts and the visible list now update together.

**Root cause:** The parent mutates its array with `push` and passes that same array reference to an OnPush child. Angular checks the parent after the click, but the unchanged input reference does not make the child eligible for a new check. A signal input on the child does not turn arbitrary mutations of its array into notifications. The Add task button deliberately belongs to the parent: handling an event inside the child could mask this bug.

**The fix:** The [case pull request](https://github.com/massimilianoborgatti/angular-bug-clinic/pulls?q=is%3Apr+head%3Acase%2F02-onpush-stale-view) replaces the array with an immutable update. The child receives a new reference, so Angular refreshes its count and task list. A parent-owned signal updated with a fresh array is another suitable state-management option; mutating an array and returning the same reference is insufficient.

**How it's tested:** One unit contract clicks the real parent button and checks the child's rendered count and text. It runs as an expected failure for Broken and passes for Fixed. Additional tests confirm reference identity and repeated additions. Playwright verifies the same behavior in a browser without forcing a child refresh.

**Takeaway:** When an OnPush component receives an updated collection, give it a new collection reference.
