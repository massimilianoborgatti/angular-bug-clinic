import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'clinic-case-10',
  imports: [RouterLink],
  template: `<article class="case-page">
    <a class="back-link" routerLink="/">← Back to the case library</a>
    <header class="case-heading">
      <p class="eyebrow">CASE 10 <span>/ WordPress · WooCommerce</span></p>
      <h1>The cart that only updated after a reload</h1>
      <p>
        Add to cart succeeds, but the custom header badge stays at zero and the spinner keeps
        running.
      </p>
    </header>
    <div class="case-workspace">
      <section class="experiment" aria-label="WordPress Playground demonstrations">
        <div class="experiment-top">
          <strong>ONE SHOP. TWO CHILD THEMES.</strong
          ><span class="experiment-label">INTERACTIVE DEMO</span>
        </div>
        <div class="look-hint">
          <span aria-hidden="true">↳</span>
          <p>
            <strong>What to look at</strong>Add Blue Mug without reloading. Compare the header
            count, total and button spinner. Then add Notebook.
          </p>
        </div>
        <div class="demo-panel">
          <h2>Open the shop in WordPress Playground</h2>
          <p>
            WordPress runs in your browser. Allow about 20–30 seconds to start; the first download
            can take longer. Each button opens a fresh shop with three fictional products.
          </p>
          <div class="row">
            <a
              class="button"
              [href]="playground('broken')"
              target="_blank"
              rel="noopener noreferrer"
              >Open Broken in WordPress Playground</a
            >
            <a
              class="button primary"
              [href]="playground('fixed')"
              target="_blank"
              rel="noopener noreferrer"
              >Open Fixed in WordPress Playground</a
            >
          </div>
          <p>
            <strong>Broken:</strong> View cart appears, but the badge remains 0 and the spinner
            stays on. Reloading reveals the actual cart.
          </p>
          <p>
            <strong>Fixed:</strong> the badge becomes 1, the total shows $12.00 and the spinner
            stops. Adding Notebook makes the count 2 and the total $20.00.
          </p>
          <p>
            Use the browser Network panel to inspect the add-to-cart response. Its fragment selector
            must match the header element.
          </p>
        </div>
      </section>
      <aside class="case-notes">
        <div>
          <span class="note-index">01 / THE DIAGNOSIS</span>
          <h2>Why it happens</h2>
          <p>
            The child theme returns a fragment under an old selector. Nothing replaces the new
            header, and its spinner waits for a badge change that never arrives.
          </p>
        </div>
        <div>
          <span class="note-index">02 / THE REPAIR</span>
          <h2>What changes</h2>
          <p>
            Build the header and its fragment with shared markup and the same selector. Stop the
            spinner on added_to_cart or request failure.
          </p>
        </div>
        <div class="takeaway">
          <span class="note-index">TAKE IT WITH YOU</span>
          <p>A successful request cannot repair a selector that points nowhere.</p>
        </div>
        <a
          href="https://github.com/massimilianoborgatti/angular-bug-clinic/blob/main/docs/cases/10-woocommerce-cart.md"
          >Read the case write-up ↗</a
        >
      </aside>
    </div>
  </article>`,
})
export class Case10 {
  playground(variant: 'broken' | 'fixed'): string {
    const blueprint =
      'https://massimilianoborgatti.github.io/angular-bug-clinic/wp/case-10/blueprint-' +
      variant +
      '.json';
    return 'https://playground.wordpress.net/?blueprint-url=' + encodeURIComponent(blueprint);
  }
}
