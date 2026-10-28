export const COUNTER_TEMPLATE = `
  <section class="demo-card" aria-label="Live notification widget">
    <p class="metric-label">Live widget #{{ widgetId }}</p>
    <p class="metric" data-testid="widget-received">{{ received() }}</p>
    <p class="muted">Notifications received by this mounted widget</p>
  </section>
`;
