import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BrokenTaskBoard } from './broken/broken-task-board';
import { FixedTaskBoard } from './fixed/fixed-task-board';

const variants: {
  name: string;
  component: Type<BrokenTaskBoard | FixedTaskBoard>;
  broken: boolean;
}[] = [
  { name: 'Broken', component: BrokenTaskBoard, broken: true },
  { name: 'Fixed', component: FixedTaskBoard, broken: false },
];

describe('02 — parent to OnPush child rendering contract', () => {
  for (const variant of variants) {
    it(
      variant.name + ': adding a task must update the child view',
      {
        fails: variant.broken,
      },
      async () => {
        TestBed.configureTestingModule({ imports: [variant.component] });
        const fixture = TestBed.createComponent(variant.component);
        await fixture.whenStable();
        const root = fixture.nativeElement as HTMLElement;
        const button = root.querySelector<HTMLButtonElement>('button');
        expect(root.querySelector('[data-testid="child-count"]')?.textContent?.trim()).toBe('2');
        expect(button).not.toBeNull();

        // A real parent event schedules rendering without manually refreshing the child.
        button?.click();
        await fixture.whenStable();

        expect(root.querySelector('[data-testid="parent-count"]')?.textContent?.trim()).toBe('3');
        // Exactly this assertion is expected to fail for Broken (the child still shows 2).
        expect(root.querySelector('[data-testid="child-count"]')?.textContent?.trim()).toBe('3');
        expect(root.querySelector('[data-testid="child-task-list"]')?.textContent).toContain(
          'Prepare task 3',
        );
      },
    );
  }

  it('characterizes Broken: the model grows while the OnPush child remains stale', async () => {
    TestBed.configureTestingModule({ imports: [BrokenTaskBoard] });
    const fixture = TestBed.createComponent(BrokenTaskBoard);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const original = fixture.componentInstance.items;

    root.querySelector<HTMLButtonElement>('button')?.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.items).toBe(original);
    expect(fixture.componentInstance.items).toHaveLength(3);
    expect(root.querySelector('[data-testid="parent-count"]')?.textContent?.trim()).toBe('3');
    expect(root.querySelector('[data-testid="child-count"]')?.textContent?.trim()).toBe('2');
    expect(root.querySelector('[data-testid="child-task-list"]')?.textContent).not.toContain(
      'Prepare task 3',
    );
  });

  it('characterizes Fixed: each addition replaces the array and renders every new task', async () => {
    TestBed.configureTestingModule({ imports: [FixedTaskBoard] });
    const fixture = TestBed.createComponent(FixedTaskBoard);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const original = fixture.componentInstance.items;

    root.querySelector<HTMLButtonElement>('button')?.click();
    await fixture.whenStable();
    root.querySelector<HTMLButtonElement>('button')?.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.items).not.toBe(original);
    expect(original).toHaveLength(2);
    expect(root.querySelector('[data-testid="child-count"]')?.textContent?.trim()).toBe('4');
    expect(root.querySelector('[data-testid="child-task-list"]')?.textContent).toContain(
      'Prepare task 4',
    );
  });
});
