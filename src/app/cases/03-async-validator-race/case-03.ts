import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaseFrame } from '../../shared/case-frame';
import { BrokenUsername } from './broken/broken-username';
import { FixedUsername } from './fixed/fixed-username';

@Component({
  selector: 'clinic-case-03',
  imports: [CaseFrame, BrokenUsername, FixedUsername],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <clinic-case-frame caseId="03" #frame>
      @if (frame.variant() === 'broken') {
        <clinic-broken-username />
      } @else {
        <clinic-fixed-username />
      }
    </clinic-case-frame>
  `,
})
export class Case03 {}
