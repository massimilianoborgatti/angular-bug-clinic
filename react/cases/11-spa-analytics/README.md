# 11 — Page views that lied

## Symptom

Demo Plant Shop records two page views before a visitor answers its consent banner, then no further views while browsing. The inspector exposes every local gtag command. No Google scripts, cookies or tracking requests are used.

## How to reproduce

Open the [demo](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/11-spa-analytics/). Broken starts at two views. Accept and follow Home → Plants → Monstera → Choose clay pot: it stays at two. Fixed starts at zero; accepting and following the same journey produces four views with distinct locations and matching titles. Start a fresh Fixed session and Reject: navigating or adding to the wishlist leaves only consent signals. Tabs reset the session; consent is deliberately not persisted.

## Root cause

The config's automatic page view overlaps a mount-only layout effect. The persistent layout does not remount during client navigation, so the effect misses subsequent pages and query changes. Both event paths ignore consent. SPAs need virtual views because a new screen need not load a new document.

## The fix

The [tracker](../../src/analytics/tracker.ts) initializes Consent Mode v2 with analytics_storage, ad_storage, ad_user_data and ad_personalization denied, before anything else. A choice updates those signals. Only acceptance configures the fake property with send_page_view: false. Rejection emits no config or analytics events; this intentionally models strict blocking rather than advanced-mode cookieless measurement.

One [usePageViews hook](../../src/analytics/use-page-views.ts), inside Suspense, observes pathname and search parameters, gates on consent and deduplicates consecutive locations. It sends the current screen after delayed acceptance without replaying denied visits. The wishlist uses currency, value and items with item_id, item_name, item_variant, price and quantity.

In Tag Manager, choose one owner: a History Change trigger or a custom page_view trigger. The latter needs dataLayer objects with event: 'page_view' and route parameters; this inspector shows gtag command tuples. Disable overlapping automatic/history measurement. On a real site, use GTM Preview / Tag Assistant to inspect consent ordering, variables and tag firing, then GA4 DebugView to verify one view per navigation and query change.

## How it's tested

Unit and static-export browser contracts compare both variants, marking Broken failures as expected. Separate checks prove its duplicate/missing-view symptom. Tests cover rejection, full locations, titles, query changes, Strict Mode, Back, wishlist parameters and absence of external requests.

## Takeaway

Give page views one route-aware owner, and gate measurement before sending events.

[SPA measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications) · [Consent mode](https://developers.google.com/tag-platform/security/guides/consent) · [Next.js search parameters](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
