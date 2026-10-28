import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TASK_DEMO_TEMPLATE } from '../shared/task-demo-template';
import { TaskList } from '../shared/task-list';
import { initialTasks, nextTask } from '../shared/task';

@Component({
  selector: 'clinic-broken-task-board',
  imports: [TaskList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: TASK_DEMO_TEMPLATE,
})
export class BrokenTaskBoard {
  items = initialTasks();

  addTask(): void {
    this.items.push(nextTask(this.items.length));
  }
}
