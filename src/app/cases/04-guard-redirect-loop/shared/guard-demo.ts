import { inject, Injectable, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const CASE_04_BASE = '/cases/04-guard-redirect-loop';
export type GuardVariant = 'broken' | 'fixed';

@Injectable({ providedIn: 'root' })
export class GuardDemoState {
  readonly variant = signal<GuardVariant>('broken');
  readonly authenticated = signal(false);
  readonly redirects = signal(0);
  readonly events = signal<string[]>([]);

  prepare(variant: GuardVariant): void {
    if (this.variant() !== variant) this.reset(variant);
  }

  reset(variant: GuardVariant): void {
    this.variant.set(variant);
    this.authenticated.set(false);
    this.redirects.set(0);
    this.events.set([]);
  }

  record(message: string): void {
    this.events.update((events) => [...events, message]);
  }
}

export function safeReturnUrl(candidate: string | null): string {
  const taskRoute = `${CASE_04_BASE}/fixed/tasks`;
  return candidate === taskRoute ? candidate : taskRoute;
}

export const brokenAuthGuard: CanActivateFn = (_route, navigation) => {
  const state = inject(GuardDemoState);
  const router = inject(Router);
  state.prepare('broken');
  if (state.authenticated()) return true;
  state.redirects.update((count) => count + 1);
  state.record(`Guard attempt ${state.redirects()}: ${navigation.url.split('?')[0]}`);
  // This stop is demonstration containment, not the fix: login remains guarded.
  if (state.redirects() >= 4) {
    return router.createUrlTree([CASE_04_BASE, 'broken', 'stopped']);
  }
  return router.createUrlTree([CASE_04_BASE, 'broken', 'login'], {
    queryParams: { returnUrl: navigation.url, attempt: state.redirects() },
  });
};

export const fixedAuthGuard: CanActivateFn = (_route, navigation) => {
  const state = inject(GuardDemoState);
  const router = inject(Router);
  state.prepare('fixed');
  if (state.authenticated()) return true;
  state.redirects.update((count) => count + 1);
  state.record(`Redirect ${state.redirects()}: tasks → login`);
  return router.createUrlTree([CASE_04_BASE, 'fixed', 'login'], {
    queryParams: { returnUrl: navigation.url },
  });
};
