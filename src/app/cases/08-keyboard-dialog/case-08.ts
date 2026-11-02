import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CaseFrame } from '../../shared/case-frame';
import { BrokenDialog } from './broken-dialog';
import { FixedDialog } from './fixed-dialog';
@Component({
  selector: 'clinic-case-08',
  imports: [CaseFrame, BrokenDialog, FixedDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<clinic-case-frame caseId="08" #frame>
    @if (frame.variant() === 'broken') {
      <clinic-broken-dialog />
    } @else {
      <clinic-fixed-dialog />
    }
  </clinic-case-frame>`,
})
export class Case08 {}
