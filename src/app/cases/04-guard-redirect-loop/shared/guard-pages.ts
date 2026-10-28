import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuardDemoState, safeReturnUrl } from './guard-demo';

@Component({
  selector: 'clinic-guard-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="stack" data-testid="guard-login">
      <h3>Demo login</h3>
      <p>The login page is reachable. This local session uses no account or password.</p>
      <p class="code-note">Return to: {{ returnUrl }}</p>
      <button type="button" (click)="login()">Log in to demo</button>
    </section>
  `,
})
export class GuardLogin {
  private readonly router = inject(Router);
  private readonly state = inject(GuardDemoState);
  readonly returnUrl = safeReturnUrl(
    inject(ActivatedRoute).snapshot.queryParamMap.get('returnUrl'),
  );

  login(): void {
    this.state.prepare('fixed');
    this.state.authenticated.set(true);
    this.state.record('Local login complete; returning to the requested task list.');
    void this.router.navigateByUrl(this.returnUrl);
  }
}

@Component({
  selector: 'clinic-guard-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="stack success" data-testid="guard-tasks">
      <h3>Protected task list</h3>
      <p>Login complete. The original destination is now open.</p>
      <ul>
        <li>Review today's tasks</li>
        <li>Plan the next small improvement</li>
      </ul>
    </section>
  `,
})
export class GuardTasks {}

@Component({
  selector: 'clinic-guard-stopped',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="stack danger" data-testid="guard-stopped">
      <h3>Redirect loop stopped</h3>
      <p>The login page was guarded too. Four attempts were enough to reveal the loop.</p>
      <p>
        A safety limit keeps this teaching example responsive; it does not repair the route
        configuration.
      </p>
    </section>
  `,
})
export class GuardStopped {}
