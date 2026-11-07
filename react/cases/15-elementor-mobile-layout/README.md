# Case 15 — Elementor mobile layout fixes

Northline Bicycle Workshop is a fictional WordPress landing page created by Codex in Elementor Free with the Hello Elementor theme. The exported portfolio page shows screenshots from that local lab. The contact form is a visual exercise.

## Reproduce the issue

Open the Broken screenshot at 390 px. The oversized hero copy makes the page scroll sideways, the desktop menu is clipped, three service cards share a narrow row and the testimonials disappear.

## Root cause and repair

- The mobile hero used a fixed copy width. Use the available container width.
- The mobile cards inherited the desktop row. Switch to a column, use full-width cards and reduce mobile section padding.
- Testimonials had a mobile hide flag. Clear it so the same section appears at every tested width.
- The desktop navigation remained visible. Show a native disclosure with the same anchor links on mobile.
- The first form field was wider than its container. Use scoped CSS for the Elementor Free HTML widget with fluid widths and a desktop maximum.

## Verification

The original WordPress browser check measured a 540 px document in a 390 px viewport for Broken and a 390 px document for Fixed. Fixed showed three distinct card rows, one testimonials section, and form controls within their container. The desktop screenshots were byte-identical at 1280 px. The 820 px view was also checked. Keyboard and pointer opened and closed the mobile menu. The Services and Contact links reached their sections, focus was visible and the preview button generated no form submission.

## Takeaway

Check both the viewport and the content width. A single fixed child can break a layout whose outer containers already appear responsive.
