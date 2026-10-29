import { Component, viewChild } from '@angular/core';
import { CaseFrame } from '../../shared/case-frame';
import { BrokenBackButton } from './broken/broken-back-button';
import { FixedBackButton } from './fixed/fixed-back-button';

@Component({
  selector: 'clinic-case-05',
  imports: [CaseFrame, BrokenBackButton, FixedBackButton],
  templateUrl: './case-05.html',
})
export class Case05 {
  private readonly broken = viewChild(BrokenBackButton);
  private readonly fixed = viewChild(FixedBackButton);

  async beforeLeave(): Promise<boolean> {
    await (this.broken() ?? this.fixed())?.dismissBeforeLeave();
    return true;
  }
}
