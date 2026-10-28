import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Task } from './task';

@Component({
  selector: 'clinic-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="demo-card" aria-label="OnPush child task list">
      <p class="metric-label">OnPush child · rendered tasks</p>
      <p class="metric" data-testid="child-count">{{ items().length }}</p>
      <ul class="event-log" data-testid="child-task-list">
        @for (task of items(); track task.id) {
          <li>{{ task.title }}</li>
        }
      </ul>
    </section>
  `,
})
export class TaskList {
  readonly items = input.required<readonly Task[]>();
}
