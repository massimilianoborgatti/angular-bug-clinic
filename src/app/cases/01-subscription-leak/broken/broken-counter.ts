import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { COUNTER_TEMPLATE } from '../shared/counter-template';
import { NotificationFeed } from '../shared/notification-feed';

@Component({
  selector: 'clinic-broken-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: COUNTER_TEMPLATE,
})
export class BrokenCounter implements OnInit {
  private readonly feed = inject(NotificationFeed);
  readonly widgetId = this.feed.allocateWidgetId();
  readonly received = signal(0);

  ngOnInit(): void {
    this.feed.notifications.subscribe((notification) => {
      this.received.update((count) => count + 1);
      this.feed.record(this.widgetId, notification);
    });
  }
}
