import { Injectable, OnDestroy, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationFeed implements OnDestroy {
  private readonly source = new Subject<number>();
  private nextWidget = 0;
  readonly activeSubscriptions = signal(0);
  readonly emitted = signal(0);
  readonly handled = signal(0);
  readonly log = signal<string[]>([]);

  readonly notifications = new Observable<number>((subscriber) => {
    this.activeSubscriptions.update((count) => count + 1);
    const subscription = this.source.subscribe(subscriber);
    return () => {
      subscription.unsubscribe();
      this.activeSubscriptions.update((count) => count - 1);
    };
  });

  allocateWidgetId(): number {
    return ++this.nextWidget;
  }

  emit(): void {
    const notification = this.emitted() + 1;
    this.emitted.set(notification);
    this.source.next(notification);
  }

  record(widgetId: number, notification: number): void {
    const entry = 'Widget #' + widgetId + ' handled notification ' + notification;
    this.handled.update((count) => count + 1);
    this.log.update((entries) => [...entries, entry].slice(-12));
    console.info('[case-01] ' + entry);
  }

  ngOnDestroy(): void {
    // The outer demonstration owns the feed and releases deliberate leaks on exit.
    this.source.complete();
  }
}
