import { DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CASE_04_BASE, GuardDemoState, GuardVariant } from './guard-demo';

export abstract class GuardDemo {
  protected readonly router = inject(Router);
  protected readonly destroyRef = inject(DestroyRef);
  readonly state = inject(GuardDemoState);
  readonly currentPath = signal(this.router.url.split('?')[0]);
  abstract readonly variant: GuardVariant;

  protected initialize(): void {
    this.state.prepare(this.variant);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.currentPath.set(event.urlAfterRedirects.split('?')[0]));
    const otherVariant = this.variant === 'broken' ? 'fixed' : 'broken';
    if (this.router.url.includes(`${CASE_04_BASE}/${otherVariant}/`)) {
      void this.router.navigateByUrl(CASE_04_BASE, { replaceUrl: true });
    }
  }

  async openTasks(): Promise<void> {
    this.state.reset(this.variant);
    const destination = `${CASE_04_BASE}/${this.variant}/tasks`;
    // Replaying the example must run the guard even if tasks are already open.
    if (this.router.url.split('?')[0] === destination) {
      await this.router.navigateByUrl(CASE_04_BASE, { replaceUrl: true });
    }
    await this.router.navigateByUrl(destination);
  }

  reset(): void {
    this.state.reset(this.variant);
    void this.router.navigateByUrl(CASE_04_BASE);
  }
}
