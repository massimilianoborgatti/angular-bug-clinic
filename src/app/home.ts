import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { cases } from './catalog';
@Component({
  selector: 'clinic-home',
  imports: [RouterLink],
  template: `<section class="home-hero">
      <div>
        <p class="eyebrow"><span class="tiny-cross">+</span> THE DEBUGGING NOTEBOOK</p>
        <h1>Find the bug.<br />Understand the <em>fix.</em></h1>
        <p class="hero-copy">
          Five small Angular &amp; Ionic case studies.<br />Real symptoms, focused fixes, and tests
          that prove the difference.
        </p>
        <a class="button primary" [routerLink]="['/cases', cases[0].slug]"
          >Explore the first case <span aria-hidden="true">↗</span></a
        >
      </div>
      <div class="hero-note">
        <span class="note-label">A CASE, IN THREE STEPS</span>
        <div>
          <span class="step-number">01</span>
          <p><strong>Reproduce</strong><small>See the broken behavior.</small></p>
          <span class="step-mark">↗</span>
        </div>
        <div>
          <span class="step-number">02</span>
          <p><strong>Repair</strong><small>Make one focused change.</small></p>
          <span class="step-mark">↗</span>
        </div>
        <div>
          <span class="step-number">03</span>
          <p><strong>Prove</strong><small>Run the same test again.</small></p>
          <span class="proof-mark">✓</span>
        </div>
        <p class="note-foot">No services to connect. Just open a case and try it.</p>
      </div>
    </section>
    <section class="library">
      <div class="section-heading">
        <div>
          <p class="eyebrow">THE CASE LIBRARY</p>
          <h2>Little details. Noticeable consequences.</h2>
        </div>
        <span class="case-total">05 cases / one clear approach</span>
      </div>
      <div class="case-grid">
        @for (item of cases; track item.id) {
          <a class="case-card" [routerLink]="['/cases', item.slug]"
            ><div class="card-top">
              <span class="case-number">CASE {{ item.id }}</span
              ><span class="tag">{{ item.category }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.symptom }}</p>
            <div class="card-bottom">
              <span>{{ item.ready ? 'Broken → Fixed' : 'Coming in its own PR' }}</span
              ><span aria-hidden="true">↗</span>
            </div></a
          >
        }
      </div>
    </section>`,
})
export class Home {
  readonly cases = cases;
}
