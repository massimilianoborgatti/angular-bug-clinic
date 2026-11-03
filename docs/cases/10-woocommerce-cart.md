# 10 — The cart that only updated after a reload

## Symptom

A fictional shop accepts an AJAX addition and shows View cart, yet its custom header count remains zero, the total stays unchanged and a button spinner keeps running. Reloading reveals the product in the cart. The request succeeded; its visible feedback did not.

## How to reproduce

Open the [case page](https://massimilianoborgatti.github.io/angular-bug-clinic/#/cases/10-woocommerce-cart) and launch Broken in WordPress Playground. Add Blue Mug without reloading. Compare the header with the View cart confirmation, then reload. Open Fixed in a fresh Playground and repeat: the badge becomes one, the total is $12.00 and the spinner stops. Adding Notebook makes two items and $20.00.

## Root cause

The child theme replaced Storefront's header cart, but its fragment filter still returns an old selector. WooCommerce's `wc-add-to-cart` script replaces response fragments by selector when `added_to_cart` fires. The old selector matches nothing. The custom spinner waits for the badge's text to change, so it never receives its completion signal.

`wc-cart-fragments` also refreshes cart fragments and maintains its browser cache. Loading that script alone cannot correct a mismatched key in `woocommerce_add_to_cart_fragments`.

## The fix

The [Fixed child theme](../../wordpress/case-10/fixed/bug-clinic-shop/) builds the header and fragment through one markup function and derives the fragment selector from the same class. Its script ends pending feedback on `added_to_cart` and AJAX failure instead of observing a DOM mutation.

The repair belongs in a child theme so parent-theme updates do not overwrite it. No plugin or theme updates, reinstalls or unrelated changes are needed. Both variants use identical product data and dependency versions.

To inspect the contract, open the browser Network tab, select `?wc-ajax=add_to_cart` and read the JSON `fragments` keys. The custom key must select the printed header link.

## How it's tested

The same browser contracts check the first addition, its total, spinner completion, a second addition and selector matching. Broken is an expected failure; a separate check proves the stale feedback despite a successful addition. Fixed also checks request failure. PHP syntax is parsed through Playground; JavaScript uses formatting and lint checks.

## Takeaway

Match the fragment to the element, and finish request feedback on a request event.
