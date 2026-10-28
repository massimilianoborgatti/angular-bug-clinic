import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrokenUsername } from './broken/broken-username';
import { FixedUsername } from './fixed/fixed-username';

afterEach(() => vi.useRealTimers());

for (const [mode, component] of [
  ['Broken', BrokenUsername],
  ['Fixed', FixedUsername],
] as const) {
  describe(`${mode} username validation`, () => {
    const provesInvariant = mode === 'Broken' ? it.fails : it;

    provesInvariant('only the current value can decide availability', async () => {
      vi.useFakeTimers();
      TestBed.configureTestingModule({ imports: [component] });
      const fixture = TestBed.createComponent(component);
      fixture.detectChanges();
      fixture.componentInstance.reproduceRace();
      expect(fixture.componentInstance.pending()).toBe(true);
      await vi.advanceTimersByTimeAsync(1300);
      fixture.detectChanges();
      expect(fixture.componentInstance.username.value).toBe('freshname');
      expect(fixture.componentInstance.username.errors).toBeNull();
      expect(fixture.componentInstance.checkedName()).toBe('freshname');
      expect(
        fixture.nativeElement.querySelector('[data-testid="validation-status"]').textContent,
      ).toContain('Username available');
      fixture.destroy();
    });
  });
}

it('characterizes the Broken response arriving for an older value', async () => {
  vi.useFakeTimers();
  TestBed.configureTestingModule({ imports: [BrokenUsername] });
  const fixture = TestBed.createComponent(BrokenUsername);
  fixture.detectChanges();
  fixture.componentInstance.reproduceRace();
  await vi.advanceTimersByTimeAsync(1300);
  expect(fixture.componentInstance.username.value).toBe('freshname');
  expect(fixture.componentInstance.checkedName()).toBe('taken');
  expect(fixture.componentInstance.username.hasError('taken')).toBe(true);
  expect(fixture.componentInstance.responses()).toEqual([
    'freshname: available',
    'taken: unavailable',
  ]);
  fixture.destroy();
});

it('cancels the obsolete Fixed request and reports pending while checking', async () => {
  vi.useFakeTimers();
  TestBed.configureTestingModule({ imports: [FixedUsername] });
  const fixture = TestBed.createComponent(FixedUsername);
  fixture.detectChanges();
  fixture.componentInstance.reproduceRace();
  await vi.advanceTimersByTimeAsync(160);
  expect(fixture.componentInstance.pending()).toBe(true);
  await vi.advanceTimersByTimeAsync(1140);
  expect(fixture.componentInstance.responses()).toEqual(['freshname: available']);
  expect(fixture.componentInstance.pending()).toBe(false);
  fixture.destroy();
});
