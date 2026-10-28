import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { COUNTER_TEMPLATE } from '../shared/counter-template';
import { NotificationFeed } from '../shared/notification-feed';

@Component({
  selector: 'clinic-fixed-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: COUNTER_TEMPLATE,
})
export class FixedCounter implements OnInit {
  private readonly feed = inject(NotificationFeed);
  private readonly destroyRef = inject(DestroyRef);
  readonly widgetId = this.feed.allocateWidgetId();
  readonly received = signal(0);

  ngOnInit(): void {
    this.feed.notifications.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((notification) => {
      this.received.update((count) => count + 1);
      this.feed.record(this.widgetId, notification);
    });
  }
}
