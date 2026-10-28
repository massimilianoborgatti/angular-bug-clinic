import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GuardDemo } from '../shared/guard-demo-component';
import { GUARD_DEMO_TEMPLATE } from '../shared/guard-demo-template';

@Component({
  selector: 'clinic-fixed-guard',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: GUARD_DEMO_TEMPLATE,
})
export class FixedGuard extends GuardDemo implements OnInit {
  readonly variant = 'fixed' as const;

  ngOnInit(): void {
    this.initialize();
  }
}
