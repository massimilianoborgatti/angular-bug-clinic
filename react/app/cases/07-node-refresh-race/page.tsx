'use client';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { TaskDashboard } from '../../../src/refresh/dashboard';
import { DEMO_API } from '../../../src/refresh/handlers';
import './case-07.css';
type Variant = 'Broken' | 'Fixed';
export default function Page() {
  const [variant, setVariant] = useState<Variant>('Broken');
  const [connection, setConnection] = useState<{ base: string } | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function connect() {
      const local =
        location.hostname === '127.0.0.1' &&
        new URLSearchParams(location.search).get('api') === 'local';
      if (!local) await (await import('../../../src/refresh/browser')).startDemo();
      if (active) setConnection({ base: local ? 'http://127.0.0.1:4500' : DEMO_API });
    }
    void connect().catch(() => {
      if (active) setError('Unable to start the demo. Reload this page to try again.');
    });
    return () => {
      active = false;
    };
  }, []);
  function selectTab(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 'Broken'
        : event.key === 'End'
          ? 'Fixed'
          : variant === 'Broken'
            ? 'Fixed'
            : 'Broken';
    setVariant(next);
    document.getElementById(next + '-tab')?.focus();
  }
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/angular-bug-clinic/#/" aria-label="Angular Bug Clinic home">
          <span className="brand-icon" aria-hidden="true">
            +
          </span>
          <span>
            Angular <strong>Bug Clinic</strong>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/angular-bug-clinic/#/">Case library</a>
          <a href="/angular-bug-clinic/react/">Case 06</a>
          <a href="/angular-bug-clinic/react/cases/07-node-refresh-race/" aria-current="page">
            Case 07
          </a>
          <a href="/angular-bug-clinic/react/cases/09-form-errors/">Case 09</a>
          <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/07-node-refresh-race">
            Source code ↗
          </a>
        </nav>
        <span className="header-note">Small bugs. Clear fixes.</span>
      </header>
      <main className="case-page">
        <a className="back-link" href="/angular-bug-clinic/#/">
          ← Back to the case library
        </a>
        <header className="case-heading">
          <p className="eyebrow">
            CASE 07 <span>/ React · Node.js</span>
          </p>
          <h1>Logged out at random</h1>
          <p>
            Three expired requests race to refresh one session. A reused token logs everyone out.
          </p>
        </header>
        <div className="case-workspace">
          <section className="experiment" aria-label="Interactive demonstration">
            <div className="experiment-top">
              <div role="tablist" aria-label="Implementation">
                {(['Broken', 'Fixed'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    id={item + '-tab'}
                    aria-controls="demo-panel"
                    aria-selected={variant === item}
                    tabIndex={variant === item ? 0 : -1}
                    className={variant === item ? 'selected' : ''}
                    onClick={() => setVariant(item)}
                    onKeyDown={selectTab}
                  >
                    <span className={'tab-dot ' + item.toLowerCase() + '-dot'} />
                    {item}
                  </button>
                ))}
              </div>
              <span className="experiment-label">INTERACTIVE DEMO</span>
            </div>
            <div className="look-hint">
              <span aria-hidden="true">↳</span>
              <p>
                <strong>What to look at</strong>Log in, wait five seconds, then reload the
                dashboard. Compare the refresh count and session event log in Broken and Fixed.
              </p>
            </div>
            <div
              className="demo-panel"
              id="demo-panel"
              role="tabpanel"
              aria-labelledby={variant + '-tab'}
            >
              <div className="variant-caption">
                <span className={'status ' + (variant === 'Broken' ? 'danger' : 'success')}>
                  {variant === 'Broken' ? 'BUG REPRODUCED' : 'FIX APPLIED'}
                </span>
                <span>
                  Same scenario.{' '}
                  {variant === 'Broken' ? 'Three competing refreshes.' : 'A focused change.'}
                </span>
              </div>
              {connection ? (
                <TaskDashboard key={variant} fixed={variant === 'Fixed'} base={connection.base} />
              ) : (
                <p role="status">{error || 'Preparing the demo…'}</p>
              )}
            </div>
          </section>
          <aside className="case-notes">
            <div>
              <span className="note-index">01 / THE DIAGNOSIS</span>
              <h2>Why it happens</h2>
              <p>
                Each expired request refreshes independently. Reusing the previous refresh token
                revokes the whole session, including the first successful refresh.
              </p>
            </div>
            <div>
              <span className="note-index">02 / THE REPAIR</span>
              <h2>What changes</h2>
              <p>
                Share one pending refresh promise, then retry each request once with the new access
                token. Keep server-side reuse detection strict.
              </p>
            </div>
            <div className="takeaway">
              <span className="note-index">TAKE IT WITH YOU</span>
              <p>
                One session needs one refresh in flight, even when several requests expire together.
              </p>
            </div>
            <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/07-node-refresh-race">
              Read the case write-up ↗
            </a>
          </aside>
        </div>
      </main>
      <footer className="site-footer">
        <span>Built to make debugging visible.</span>
        <span>React · Express · TypeScript</span>
        <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/blob/main/LICENSE">
          MIT licensed
        </a>
      </footer>
    </>
  );
}
