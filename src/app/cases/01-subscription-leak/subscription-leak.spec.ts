import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrokenCounter } from './broken/broken-counter';
import { FixedCounter } from './fixed/fixed-counter';
import { NotificationFeed } from './shared/notification-feed';

const variants: {
  name: string;
  component: Type<BrokenCounter | FixedCounter>;
  broken: boolean;
}[] = [
  { name: 'Broken', component: BrokenCounter, broken: true },
  { name: 'Fixed', component: FixedCounter, broken: false },
];

afterEach(() => vi.restoreAllMocks());

describe('01 — subscription teardown contract', () => {
  for (const variant of variants) {
    it(
      variant.name + ': destroyed widgets must not handle later notifications',
      {
        fails: variant.broken,
      },
      async () => {
        TestBed.configureTestingModule({
          imports: [variant.component],
          providers: [NotificationFeed],
        });
        const fixture = TestBed.createComponent(variant.component);
        await fixture.whenStable();
        const feed = TestBed.inject(NotificationFeed);
        const log = vi.spyOn(console, 'info').mockImplementation(() => undefined);
        feed.emit();
        expect(feed.handled()).toBe(1);
        fixture.destroy();
        feed.emit();

        // Exactly this assertion is expected to fail for Broken (2 instead of 1).
        expect(feed.handled()).toBe(1);
        log.mockRestore();
      },
    );
  }

  it('characterizes Broken: three destroyed widgets leave three live handlers', async () => {
    TestBed.configureTestingModule({ imports: [BrokenCounter], providers: [NotificationFeed] });
    const feed = TestBed.inject(NotificationFeed);
    const log = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    for (let visit = 0; visit < 3; visit++) {
      const fixture = TestBed.createComponent(BrokenCounter);
      await fixture.whenStable();
      fixture.destroy();
    }

    expect(feed.activeSubscriptions()).toBe(3);
    feed.emit();
    expect(feed.handled()).toBe(3);
    expect(log).toHaveBeenCalledTimes(3);
    feed.ngOnDestroy();
    expect(feed.activeSubscriptions()).toBe(0);
    feed.emit();
    expect(feed.handled()).toBe(3);
    log.mockRestore();
  });

  it('characterizes Fixed: destroying a widget releases its subscription', async () => {
    TestBed.configureTestingModule({ imports: [FixedCounter], providers: [NotificationFeed] });
    const fixture = TestBed.createComponent(FixedCounter);
    await fixture.whenStable();
    const feed = TestBed.inject(NotificationFeed);
    expect(feed.activeSubscriptions()).toBe(1);
    fixture.destroy();
    expect(feed.activeSubscriptions()).toBe(0);
  });
});
