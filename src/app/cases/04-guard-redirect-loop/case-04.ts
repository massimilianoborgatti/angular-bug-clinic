import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFrame } from '../../shared/case-frame';
import { BrokenGuard } from './broken/broken-guard';
import { FixedGuard } from './fixed/fixed-guard';

@Component({
  selector: 'clinic-case-04',
  imports: [CaseFrame, BrokenGuard, FixedGuard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <clinic-case-frame caseId="04" [initialVariant]="initialVariant" #frame>
      @if (frame.variant() === 'broken') {
        <clinic-broken-guard />
      } @else {
        <clinic-fixed-guard />
      }
    </clinic-case-frame>
  `,
})
export class Case04 {
  readonly initialVariant =
    inject(ActivatedRoute).snapshot.firstChild?.url[0]?.path === 'fixed' ? 'fixed' : 'broken';
}
