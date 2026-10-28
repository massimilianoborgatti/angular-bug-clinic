import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { cases } from '../catalog';
@Component({
  selector: 'clinic-planned-case',
  imports: [RouterLink],
  template: `<section class="planned">
    <p class="eyebrow">CASE {{ item?.id }} / IN THE NOTEBOOK</p>
    <h1>{{ item?.title }}</h1>
    <p>{{ item?.symptom }}</p>
    <div class="demo-card">
      <h2>A focused fix is on its way.</h2>
      <p>This route is ready for its own case pull request.</p>
    </div>
    <a routerLink="/">← Back to the case library</a>
  </section>`,
})
export class PlannedCase {
  readonly item = cases.find((item) => item.slug === inject(ActivatedRoute).snapshot.data['slug']);
}
