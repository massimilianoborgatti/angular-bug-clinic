import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CaseFrame } from '../../shared/case-frame';
import { BrokenGuard } from './broken/broken-guard';
import { FixedGuard } from './fixed/fixed-guard';
import { GuardVariant } from './shared/guard-demo';

@Component({
  selector: 'clinic-case-04',
  imports: [CaseFrame, BrokenGuard, FixedGuard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <clinic-case-frame caseId="04" [initialVariant]="initialVariant()" #frame>
      @if (frame.variant() === 'broken') {
        <clinic-broken-guard />
      } @else {
        <clinic-fixed-guard />
      }
    </clinic-case-frame>
  `,
})
export class Case04 {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly frame = viewChild(CaseFrame);

  readonly initialVariant = signal<GuardVariant>(
    this.route.snapshot.firstChild?.url[0]?.path === 'fixed' ? 'fixed' : 'broken',
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        const variant = this.route.snapshot.firstChild?.url[0]?.path;
        if (variant === 'broken' || variant === 'fixed') {
          this.initialVariant.set(variant);
          // A repeated route mode must still replace a manually selected tab.
          this.frame()?.variant.set(variant);
        }
        // A base-route navigation preserves the tab the visitor just selected.
      });
  }
}
