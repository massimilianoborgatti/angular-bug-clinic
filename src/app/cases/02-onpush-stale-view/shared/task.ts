export interface Task {
  id: number;
  title: string;
}

export function initialTasks(): Task[] {
  return [
    { id: 1, title: 'Draft weekly plan' },
    { id: 2, title: 'Review task list' },
  ];
}

export function nextTask(currentCount: number): Task {
  return { id: currentCount + 1, title: 'Prepare task ' + (currentCount + 1) };
}
