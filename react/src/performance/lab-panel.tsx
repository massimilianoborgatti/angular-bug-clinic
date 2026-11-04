import results from './lab-results.json';
export function LabPanel({ fixed }: { fixed: boolean }) {
  const metrics = results.medians[fixed ? 'fixed' : 'broken'];
  return (
    <section className="lab-panel" aria-label="Recorded mobile Lighthouse medians">
      <div>
        <h2>Recorded mobile lab results</h2>
        <p>
          Lighthouse {results.lighthouseVersion} · median of 3 cold runs
          <br />
          Slow 4G · 4x CPU · score {metrics.score}/100
        </p>
      </div>
      <dl>
        {(['LCP', 'CLS', 'TBT'] as const).map((name) => {
          const value = metrics[name];
          const limit = { LCP: 2500, CLS: 0.1, TBT: 200 }[name];
          const passes = value < limit;
          return (
            <div key={name} className={passes ? 'lab-pass' : 'lab-fail'}>
              <dt>{name}</dt>
              <dd data-testid={'lab-' + name} data-status={passes ? 'pass' : 'fail'}>
                {name === 'LCP'
                  ? (value / 1000).toFixed(2) + ' s'
                  : name === 'CLS'
                    ? value.toFixed(3)
                    : Math.round(value) + ' ms'}
              </dd>
              <span>{passes ? 'Within budget' : 'Over budget'}</span>
            </div>
          );
        })}
      </dl>
      <p className="lab-caption">
        Recorded lab measurements, not this visit. Live browser LCP / CLS / INP are below the
        notebook.
      </p>
    </section>
  );
}
