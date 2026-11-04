# 12 — The landing page that felt slow

## Symptom

Northwind Notes discovers its artwork late, shifts dramatically and pauses when changing billing. Both variants share fictional content and prices. The top panel shows recorded mobile Lighthouse medians; Browser Web Vitals below reports the current visit. Nothing is transmitted.

## How to reproduce

Open the [demo](https://massimilianoborgatti.github.io/angular-bug-clinic/react/cases/12-core-web-vitals/), watch the artwork and late notice, then toggle Annual billing. Compare Fixed. Tabs load fresh documents. Recorded values remain stable; live metrics vary by device, cache and interactions.

## Root cause

Broken discovers a 952,109-byte CSS background after hydration and legacy pricing initialization. That initialization formats five billing columns for 4,000 estimates, although the card needs one price. Its font blocks text and artwork reserves no intrinsic space. A large notice enters document flow after the hero paints, moving the whole page.

## The fix

The [shared landing page](../../src/performance/landing.tsx) uses priority next/image with dimensions, sizes and preoptimized WebP files. Font preloading and font-display: swap keep text available. Reserved image space and an overlay prevent movement. A shared formatter and memoized visible projections remove repeated work from interactions.

## How it's tested

Run `npm run performance` after building the React app and installing Chromium. Both variants use the default Lighthouse mobile preset, simulated Slow 4G, 4x CPU, gzip and three cold-browser runs. Table values are medians. Adding `-- --record` refreshes the compact data snapshot used by the top panel; full reports remain untracked.

| Metric            | Broken  | Fixed   |
| ----------------- | ------- | ------- |
| LCP               | 6.909 s | 2.170 s |
| CLS               | 0.458   | 0.000   |
| TBT               | 2719 ms | 140 ms  |
| Performance score | 27/100  | 97/100  |

Fixed must keep LCP below 2.5 seconds, CLS below 0.1 and TBT below 200 milliseconds. Broken must exceed all three severity thresholds: 4 seconds, 0.25 and 500 milliseconds. Partial failure is insufficient. Playwright compares image reservations and sub-100-millisecond billing responses under 4x CPU throttling, confirms Broken symptoms and checks recorded-panel states, live metrics and mobile layout. Screenshots start at scroll position zero with the complete header visible.

TBT is a lab proxy, not INP. Lab medians cannot establish real-user Core Web Vitals; field assessment needs representative percentile data.

## Takeaway

Discover important pixels early, reserve their space and keep repeated work out of interactions.

[Web Vitals](https://github.com/GoogleChrome/web-vitals) · [Lighthouse](https://github.com/GoogleChrome/lighthouse) · [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)
