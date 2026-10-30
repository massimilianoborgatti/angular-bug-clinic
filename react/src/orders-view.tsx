'use client';
import { useState, useSyncExternalStore } from 'react';
import { createOrdersClient, type OrdersClient, type Result, type Status } from './orders';
export function useOrderControls() {
  const [status, setStatus] = useState<Status>('All');
  const [search, setSearch] = useState('');
  const [client] = useState(createOrdersClient);
  return { status, setStatus, search, setSearch, client };
}
function RequestCounter({ client }: { client: OrdersClient }) {
  // Counter updates stay in this child, so instrumentation cannot restart the parent effect.
  const count = useSyncExternalStore(client.subscribe, client.getCount, () => 0);
  return (
    <div className="request-meter">
      <span className="metric" data-testid="request-count">
        {count}
      </span>
      <span className="metric-label">Requests started</span>
    </div>
  );
}
export function OrdersView({
  controls,
  result,
}: {
  controls: ReturnType<typeof useOrderControls>;
  result: Result | null;
}) {
  const { status, setStatus, search, setSearch, client } = controls;
  const loading = !result || result.params.status !== status || result.params.search !== search;
  return (
    <div className="orders-card">
      <div className="orders-heading">
        <div>
          <p className="eyebrow">IN-MEMORY ORDERS</p>
          <h2>Orders</h2>
          <p className="muted">A small list. A busy effect.</p>
        </div>
        <RequestCounter client={client} />
      </div>
      <div className="filters">
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value as Status)}>
            <option>All</option>
            <option>Open</option>
            <option>Shipped</option>
          </select>
        </label>
        <label>
          Search orders
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try notebook"
          />
        </label>
      </div>
      <div className="results-summary">
        <span data-testid="showing">Showing: {result?.params.status ?? '—'}</span>
        <span role="status">{loading ? 'Loading current selection…' : 'Selection loaded'}</span>
      </div>
      <ul className="order-list" aria-label="Orders">
        {result?.orders.map((order) => (
          <li key={order.id}>
            <div>
              <small>{order.id}</small>
              <strong>{order.title}</strong>
            </div>
            <span className="order-status" data-testid="order-status">
              {order.status}
            </span>
          </li>
        ))}
      </ul>
      {result?.orders.length === 0 && <p className="empty">No matching orders.</p>}
      <p className="mock-note">Local mock · random delays of 100–900 ms · no external requests</p>
    </div>
  );
}
