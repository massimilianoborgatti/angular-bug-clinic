export const TASK_DEMO_TEMPLATE = `
  <div class="stack">
    <div class="row">
      <button type="button" (click)="addTask()">Add task</button>
      <span class="muted">The button belongs to the parent component.</span>
    </div>
    <p class="code-note">
      Add a task and compare the parent's array length with the child's rendered count.
      Both start at two.
    </p>
    <section class="demo-card" aria-label="Parent task state">
      <p class="metric-label">Parent · actual array length</p>
      <p class="metric" data-testid="parent-count">{{ items.length }}</p>
      <p class="muted">The parent owns this list and handles the Add task click.</p>
    </section>
    <clinic-task-list [items]="items" />
  </div>
`;
