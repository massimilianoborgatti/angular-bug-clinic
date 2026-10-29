# 04 — Route guard redirect loop

**Symptom:** A guest opens a protected task list, but the login screen never appears. The navigation trace repeatedly returns to login instead of giving the visitor a way forward.

**How to reproduce:**

1. Open the [live case](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/04-guard-redirect-loop), select **Broken**, and click **Open protected tasks**.
2. Read the four guard attempts and the **Redirect loop stopped** message.
3. Select **Fixed** and open the tasks again. Login appears after one redirect.
4. Click **Log in to demo**. The original task list opens with the same redirect count.

**Root cause:** The broken route configuration protects both the task list and its login destination with the same functional guard. A guest cannot satisfy either route, so every redirect starts another guard evaluation. This demonstration uses actual Angular Router navigation. An explicit four-attempt safety limit keeps the page responsive; that limit contains the example and is not presented as the repair.

**The fix:** Leave login accessible, protect only the task route, and return a `UrlTree` from the guard. Keep the original destination in `returnUrl`. On local login, accept only the known task destination; external, recursive, and unrelated targets fall back to that route. The session exists only in memory and asks for no credentials. See the [case PR](https://github.com/massimilianoborgatti/angular-bug-clinic/compare/c6040243cde7...c1d255ca08e7).

**How it's tested:** `RouterTestingHarness` runs the same one-redirect assertion against both route configurations. Broken is an expected failure; a separate assertion verifies its exact safety-stop trace. Fixed tests cover returning after login and rejecting unsafe targets. Playwright verifies the visible login, the completed task navigation, and the bounded Broken symptom.

**Takeaway:** A guarded destination needs a reachable recovery route and a checked return destination.
