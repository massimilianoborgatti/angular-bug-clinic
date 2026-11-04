'use client';
import { useState, type KeyboardEvent } from 'react';
import { SignupForm } from '../../../src/signup-form';
import './case-09.css';
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
          <a href="/angular-bug-clinic/react/">Case 06</a>
          <a href="/angular-bug-clinic/react/cases/07-node-refresh-race/">Case 07</a>
          <a href="/angular-bug-clinic/react/cases/09-form-errors/" aria-current="page">
            Case 09
          </a>
          <a href="/angular-bug-clinic/react/cases/11-spa-analytics/">Case 11</a>
          <a href="/angular-bug-clinic/react/cases/12-core-web-vitals/">Case 12</a>
          <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/09-form-errors">
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
            CASE 09 <span>/ React · Accessibility</span>
          </p>
          <h1>The form errors nobody heard</h1>
          <p>Errors appear in red, but labels, descriptions and a focus destination are missing.</p>
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
                <strong>What to look at</strong>Submit the empty form. Follow the keyboard focus and
                the error information. On Fixed, use the summary links to reach each field.
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
                  {variant === 'Broken' ? 'Errors without a destination.' : 'A focused change.'}
                </span>
              </div>
              <SignupForm key={variant} fixed={variant === 'Fixed'} />
            </div>
          </section>
          <aside className="case-notes">
            <div>
              <span className="note-index">01 / THE DIAGNOSIS</span>
              <h2>Why it happens</h2>
              <p>
                Visual errors do not establish accessible labels, error relationships or keyboard
                behavior.
              </p>
            </div>
            <div>
              <span className="note-index">02 / THE REPAIR</span>
              <h2>What changes</h2>
              <p>
                Add explicit labels, error descriptions, a focused summary, real submit semantics
                and a polite success status.
              </p>
            </div>
            <div className="takeaway">
              <span className="note-index">TAKE IT WITH YOU</span>
              <p>An error needs a name, a relationship and somewhere useful for focus to go.</p>
            </div>
            <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/09-form-errors">
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
