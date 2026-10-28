import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaseFrame } from '../../shared/case-frame';
import { BrokenCounter } from './broken/broken-counter';
import { FixedCounter } from './fixed/fixed-counter';
import { SubscriptionDemo } from './shared/subscription-demo';

@Component({
  selector: 'clinic-case-01',
  imports: [CaseFrame, SubscriptionDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <clinic-case-frame caseId="01" #frame>
      @if (frame.variant() === 'broken') {
        <clinic-subscription-demo [widget]="brokenWidget" />
      } @else {
        <clinic-subscription-demo [widget]="fixedWidget" />
      }
    </clinic-case-frame>
  `,
})
export class Case01 {
  readonly brokenWidget = BrokenCounter;
  readonly fixedWidget = FixedCounter;
}
