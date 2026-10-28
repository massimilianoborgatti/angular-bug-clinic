export const GUARD_DEMO_TEMPLATE = `
  <section class="demo-card stack" aria-label="Route guard demo">
    <div class="row"><span class="status">LOCAL TASK SESSION</span><span class="muted">Actual Angular Router navigation</span></div>
    <div class="comparison">
      <div><span class="metric-label">Login redirects / attempts</span><strong class="metric" data-testid="redirect-count">{{ state.redirects() }}</strong></div>
      <div><span class="metric-label">Session</span><strong class="metric">{{ state.authenticated() ? 'Logged in' : 'Guest' }}</strong></div>
    </div>
    <div class="row">
      <button type="button" (click)="openTasks()">Open protected tasks</button>
      <button type="button" (click)="reset()">Reset session</button>
    </div>
    <div class="code-note">Current route: <span data-testid="guard-current-route">{{ currentPath() }}</span></div>
    <div class="demo-card"><router-outlet /></div>
    @if (state.events().length === 0) { <p class="muted">Open the task list to start the navigation trace.</p> }
    <div class="event-log" aria-label="Navigation trace">
      @for (event of state.events(); track $index) { <p>{{ event }}</p> }
    </div>
  </section>
`;
