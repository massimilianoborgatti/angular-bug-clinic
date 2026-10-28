import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GuardDemo } from '../shared/guard-demo-component';
import { GUARD_DEMO_TEMPLATE } from '../shared/guard-demo-template';

@Component({
  selector: 'clinic-broken-guard',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: GUARD_DEMO_TEMPLATE,
})
export class BrokenGuard extends GuardDemo implements OnInit {
  readonly variant = 'broken' as const;

  ngOnInit(): void {
    this.initialize();
  }
}
