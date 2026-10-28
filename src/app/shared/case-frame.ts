import { Component, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { cases } from '../catalog';
@Component({
  selector: 'clinic-case-frame',
  imports: [RouterLink],
  template: `<article class="case-page">
    <a class="back-link" routerLink="/">← Back to the case library</a>
    <header class="case-heading">
      <p class="eyebrow">
        CASE {{ caseId() }} <span>/ {{ info().category }}</span>
      </p>
      <h1>{{ info().title }}</h1>
      <p>{{ info().symptom }}</p>
    </header>
    <div class="case-workspace">
      <section class="experiment" aria-label="Interactive demonstration">
        <div class="experiment-top">
          <div role="tablist" aria-label="Implementation">
            <button
              type="button"
              role="tab"
              id="broken-tab"
              aria-controls="demo-panel"
              [attr.aria-selected]="variant() === 'broken'"
              [class.selected]="variant() === 'broken'"
              (click)="variant.set('broken')"
              (keydown.ArrowRight)="selectTab('fixed', $event)"
              (keydown.Home)="selectTab('broken', $event)"
              (keydown.End)="selectTab('fixed', $event)"
            >
              <span class="tab-dot broken-dot"></span>Broken</button
            ><button
              type="button"
              role="tab"
              id="fixed-tab"
              aria-controls="demo-panel"
              [attr.aria-selected]="variant() === 'fixed'"
              [class.selected]="variant() === 'fixed'"
              (click)="variant.set('fixed')"
              (keydown.ArrowLeft)="selectTab('broken', $event)"
              (keydown.Home)="selectTab('broken', $event)"
              (keydown.End)="selectTab('fixed', $event)"
            >
              <span class="tab-dot fixed-dot"></span>Fixed
            </button>
          </div>
          <span class="experiment-label">INTERACTIVE DEMO</span>
        </div>
        <div class="look-hint">
          <span aria-hidden="true">↳</span>
          <p><strong>What to look at</strong>{{ info().hint }}</p>
        </div>
        <div
          id="demo-panel"
          role="tabpanel"
          [attr.aria-labelledby]="variant() + '-tab'"
          class="demo-panel"
          [class.broken-panel]="variant() === 'broken'"
          [class.fixed-panel]="variant() === 'fixed'"
        >
          <div class="variant-caption">
            <span [class]="variant() === 'broken' ? 'status danger' : 'status success'">{{
              variant() === 'broken' ? 'BUG REPRODUCED' : 'FIX APPLIED'
            }}</span
            ><span
              >Same scenario.
              {{ variant() === 'broken' ? 'A missing detail.' : 'A focused change.' }}</span
            >
          </div>
          <ng-content />
        </div>
      </section>
      <aside class="case-notes">
        <div>
          <span class="note-index">01 / THE DIAGNOSIS</span>
          <h2>Why it happens</h2>
          <p>{{ info().cause }}</p>
        </div>
        <div>
          <span class="note-index">02 / THE REPAIR</span>
          <h2>What changes</h2>
          <p>{{ info().fix }}</p>
        </div>
        <div class="takeaway">
          <span class="note-index">TAKE IT WITH YOU</span>
          <p>{{ info().takeaway }}</p>
        </div>
        <a
          [href]="
            'https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/src/app/cases/' +
            info().slug
          "
          >Read the case write-up ↗</a
        >
      </aside>
    </div>
  </article>`,
})
export class CaseFrame {
  readonly caseId = input.required<string>();
  readonly initialVariant = input<'broken' | 'fixed'>('broken');
  readonly variant = linkedSignal(() => this.initialVariant());
  readonly info = () => cases.find((item) => item.id === this.caseId())!;
  selectTab(variant: 'broken' | 'fixed', event: Event) {
    this.variant.set(variant);
    const target = event.currentTarget as HTMLElement;
    target.parentElement?.querySelector<HTMLButtonElement>('#' + variant + '-tab')?.focus();
    event.preventDefault();
  }
}
