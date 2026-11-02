import { useEffect, useRef, useState } from 'react';
import type { Task } from '../../../node/src/tokens';
import { createTaskClient } from './client';
export function TaskDashboard({ fixed, base }: { fixed: boolean; base: string }) {
  const [events, setEvents] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState('Not logged in');
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);
  const mounted = useRef(false);
  const client = useRef<ReturnType<typeof createTaskClient> | null>(null);
  useEffect(() => {
    mounted.current = true;
    const instance = createTaskClient(base, fixed, (event) => {
      if (mounted.current) setEvents((previous) => [...previous, event]);
    });
    client.current = instance;
    return () => {
      mounted.current = false;
      instance.dispose();
      client.current = null;
    };
  }, [base, fixed]);
  async function run(login: boolean) {
    const instance = client.current;
    if (!instance) return;
    setBusy(true);
    if (login) {
      setEvents([]);
      setTasks([]);
    }
    try {
      if (login) await instance.login();
      const next = await instance.load();
      if (mounted.current) {
        setTasks(next);
        setStatus('Logged in');
      }
    } catch {
      if (mounted.current) {
        setTasks([]);
        setStatus('Logged out — log in again');
      }
    } finally {
      if (mounted.current) {
        setCount(instance.count());
        setBusy(false);
      }
    }
  }
  return (
    <section className="tasks-demo" aria-label="Tasks dashboard" aria-busy={busy}>
      <div className="tasks-heading">
        <h2>Tasks dashboard</h2>
        <span className="task-session" role="status">
          {status}
        </span>
      </div>
      <p className="task-intro">
        Log in, wait five seconds, then reload all three task lists together.
      </p>
      <div className="task-controls">
        <button type="button" onClick={() => void run(true)} disabled={busy}>
          Log in to demo
        </button>
        <button
          type="button"
          onClick={() => void run(false)}
          disabled={busy || status !== 'Logged in'}
        >
          Reload dashboard
        </button>
        <span>
          Refresh calls: <strong data-testid="refresh-count">{count}</strong>
        </span>
      </div>
      <ul className="task-lists">
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.list}</span>
            <strong>{task.title}</strong>
          </li>
        ))}
      </ul>
      <h3>Session event log</h3>
      <ol className="session-log" aria-label="Session event log">
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ol>
      <p className="task-note">
        Demo session only. Tokens stay in memory; no credentials or personal data.
      </p>
    </section>
  );
}
