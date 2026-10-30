'use client';
import { useState, type KeyboardEvent } from 'react';
import { BrokenOrders } from '../src/broken-orders';
import { FixedOrders } from '../src/fixed-orders';
type Variant = 'Broken' | 'Fixed';
export default function Page() {
  const [variant, setVariant] = useState<Variant>('Broken');
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
          <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react">
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
            CASE 06 <span>/ React · Next.js</span>
          </p>
          <h1>The effect that never stopped</h1>
          <p>
            The list loads. The requests keep coming. A slower response replaces your latest choice.
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
                <strong>What to look at</strong>Watch the request counter without touching anything.
                Then switch Open → Shipped quickly: a slower Open response can replace Shipped. Try
                again if it arrives first.
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
                  {variant === 'Broken' ? 'An unstable effect.' : 'A focused change.'}
                </span>
              </div>
              {variant === 'Broken' ? <BrokenOrders /> : <FixedOrders />}
            </div>
          </section>
          <aside className="case-notes">
            <div>
              <span className="note-index">01 / THE DIAGNOSIS</span>
              <h2>Why it happens</h2>
              <p>
                A new params object restarts the effect after every response. Without cleanup, an
                earlier request can also overwrite the current selection.
              </p>
            </div>
            <div>
              <span className="note-index">02 / THE REPAIR</span>
              <h2>What changes</h2>
              <p>
                Depend on the status and search values. Ignore obsolete responses in the effect
                cleanup. Keep loading feedback tied to the current selection.
              </p>
            </div>
            <div className="takeaway">
              <span className="note-index">TAKE IT WITH YOU</span>
              <p>Stable dependencies stop the loop. Cleanup keeps the latest choice in charge.</p>
            </div>
            <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react">
              Read the case write-up ↗
            </a>
          </aside>
        </div>
      </main>
      <footer className="site-footer">
        <span>Built to make debugging visible.</span>
        <span>React · Next.js · TypeScript</span>
        <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/blob/main/LICENSE">
          MIT licensed
        </a>
      </footer>
    </>
  );
}
