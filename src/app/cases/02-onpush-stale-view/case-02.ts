import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaseFrame } from '../../shared/case-frame';
import { BrokenTaskBoard } from './broken/broken-task-board';
import { FixedTaskBoard } from './fixed/fixed-task-board';

@Component({
  selector: 'clinic-case-02',
  imports: [CaseFrame, BrokenTaskBoard, FixedTaskBoard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <clinic-case-frame caseId="02" #frame>
      @if (frame.variant() === 'broken') {
        <clinic-broken-task-board />
      } @else {
        <clinic-fixed-task-board />
      }
    </clinic-case-frame>
  `,
})
export class Case02 {}
