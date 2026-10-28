import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { describe, expect, it } from 'vitest';
import { CASE_04_BASE, GuardDemoState, safeReturnUrl } from './shared/guard-demo';
import { CASE_04_ROUTES } from './shared/guard-routes';

@Component({ imports: [RouterOutlet], template: '<router-outlet />' })
class GuardTestHost {}

async function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {
          path: 'cases/04-guard-redirect-loop',
          component: GuardTestHost,
          children: CASE_04_ROUTES,
        },
      ]),
    ],
  });
  const harness = await RouterTestingHarness.create();
  return { harness, router: TestBed.inject(Router), state: TestBed.inject(GuardDemoState) };
}

for (const variant of ['broken', 'fixed'] as const) {
  describe(`${variant} auth routing`, () => {
    const provesInvariant = variant === 'broken' ? it.fails : it;

    provesInvariant('reaches login once when a guest opens a protected route', async () => {
      const { harness, router, state } = await setup();
      await harness.navigateByUrl(`${CASE_04_BASE}/${variant}/tasks`);
      expect(router.url.split('?')[0]).toBe(`${CASE_04_BASE}/${variant}/login`);
      expect(state.redirects()).toBe(1);
      expect(harness.routeNativeElement?.textContent).toContain('Demo login');
    });
  });
}

it('characterizes the guarded-login loop and its demonstration safety limit', async () => {
  const { harness, router, state } = await setup();
  await harness.navigateByUrl(`${CASE_04_BASE}/broken/tasks`);
  expect(router.url).toBe(`${CASE_04_BASE}/broken/stopped`);
  expect(state.redirects()).toBe(4);
  expect(state.events()).toHaveLength(4);
  expect(harness.routeNativeElement?.textContent).toContain('Redirect loop stopped');
});

it('returns to the original protected route after the local login', async () => {
  const { harness, router, state } = await setup();
  const destination = `${CASE_04_BASE}/fixed/tasks`;
  await harness.navigateByUrl(destination);
  expect(router.url).toContain('returnUrl=');
  expect(state.redirects()).toBe(1);
  const loginButton = harness.routeNativeElement?.querySelector('button');
  expect(loginButton).toBeTruthy();
  loginButton?.click();
  await harness.fixture.whenStable();
  harness.detectChanges();
  expect(router.url).toBe(destination);
  expect(state.redirects()).toBe(1);
  expect(state.authenticated()).toBe(true);
  expect(harness.routeNativeElement?.textContent).toContain('Protected task list');
});

it.each([
  'https://example.invalid/tasks',
  '//example.invalid/tasks',
  `${CASE_04_BASE}/fixed/login`,
  `${CASE_04_BASE}/broken/tasks`,
  '%2F%2Fexample.invalid',
  null,
])('rejects unsafe or recursive return targets: %s', (candidate) => {
  expect(safeReturnUrl(candidate)).toBe(`${CASE_04_BASE}/fixed/tasks`);
});

it('uses the safe fallback when login receives an external return target', async () => {
  const { harness, router } = await setup();
  await harness.navigateByUrl(
    `${CASE_04_BASE}/fixed/login?returnUrl=https%3A%2F%2Fexample.invalid`,
  );
  harness.routeNativeElement?.querySelector('button')?.click();
  await harness.fixture.whenStable();
  expect(router.url).toBe(`${CASE_04_BASE}/fixed/tasks`);
});
