'use client';
import { useEffect, useState } from 'react';
import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';
export function VitalsPanel() {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    const record = (metric: Metric) => {
      if (active)
        setValues((old) => ({
          ...old,
          [metric.name]:
            metric.name === 'CLS' ? metric.value.toFixed(3) : Math.round(metric.value) + ' ms',
        }));
    };
    onLCP(record, { reportAllChanges: true });
    onCLS(record, { reportAllChanges: true });
    onINP(record, { reportAllChanges: true, durationThreshold: 0 });
    return () => {
      active = false;
    };
  }, []);
  return (
    <section className="vitals-panel" aria-label="Browser Web Vitals">
      <div>
        <h2>Browser Web Vitals</h2>
        <p>
          This visit, without lab throttling. Interact to measure INP; LCP settles after
          interaction.
        </p>
      </div>
      <dl>
        {['LCP', 'CLS', 'INP'].map((name) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd data-testid={'vital-' + name}>{values[name] || 'Waiting…'}</dd>
          </div>
        ))}
      </dl>
      <p>Browser support and background tabs affect results. No measurements leave this page.</p>
    </section>
  );
}
