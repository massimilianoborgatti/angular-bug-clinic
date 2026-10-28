import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TASK_DEMO_TEMPLATE } from '../shared/task-demo-template';
import { TaskList } from '../shared/task-list';
import { initialTasks, nextTask } from '../shared/task';

@Component({
  selector: 'clinic-fixed-task-board',
  imports: [TaskList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: TASK_DEMO_TEMPLATE,
})
export class FixedTaskBoard {
  items = initialTasks();

  addTask(): void {
    this.items = [...this.items, nextTask(this.items.length)];
  }
}
