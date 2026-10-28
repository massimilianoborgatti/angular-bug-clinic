import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Type, inject, input, signal } from '@angular/core';
import { NotificationFeed } from './notification-feed';

@Component({
  selector: 'clinic-subscription-demo',
  imports: [NgComponentOutlet],
  providers: [NotificationFeed],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stack">
      <div class="row">
        <button type="button" (click)="mounted.set(!mounted())">
          {{ mounted() ? 'Navigate away' : 'Return to widget' }}
        </button>
        <button type="button" (click)="feed.emit()">Emit notification</button>
      </div>
      <p class="code-note">
        Navigate away and return three times, then emit one notification. One mounted widget should
        produce one handler call.
      </p>
      <div class="comparison" aria-live="polite">
        <div>
          <p class="metric-label">Active subscriptions</p>
          <p class="metric" data-testid="active-subscriptions">{{ feed.activeSubscriptions() }}</p>
        </div>
        <div>
          <p class="metric-label">Notifications emitted</p>
          <p class="metric" data-testid="emitted-count">{{ feed.emitted() }}</p>
        </div>
        <div>
          <p class="metric-label">Total handler calls</p>
          <p class="metric" data-testid="handler-calls">{{ feed.handled() }}</p>
        </div>
      </div>
      @if (mounted()) {
        <ng-container [ngComponentOutlet]="widget()" />
      } @else {
        <section class="demo-card">
          <p class="status">Widget is unmounted</p>
          <p>Emit a notification now to check whether its subscription was released.</p>
        </section>
      }
      <section class="demo-card" aria-label="Notification event log">
        <p class="metric-label">Event log</p>
        @if (feed.log().length === 0) {
          <p class="muted">No notifications yet. Try the controls above.</p>
        } @else {
          <ol class="event-log" data-testid="event-log">
            @for (entry of feed.log(); track $index) {
              <li>{{ entry }}</li>
            }
          </ol>
        }
      </section>
      <p class="muted">
        These controls unmount and recreate a real Angular component. Leaving this case or changing
        tabs disposes the entire mock feed, including the deliberate leaks.
      </p>
    </div>
  `,
})
export class SubscriptionDemo {
  readonly widget = input.required<Type<unknown>>();
  readonly mounted = signal(true);
  readonly feed = inject(NotificationFeed);
}
