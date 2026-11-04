'use client';
import { useState, type KeyboardEvent } from 'react';
import { Studio } from './studio';
import './clinic.css';

export function DesignClinic() {
  const [variant, setVariant] = useState('Broken');
  function select(event: KeyboardEvent<HTMLButtonElement>) {
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
    document.getElementById('design-' + next)?.focus();
  }
  return (
    <div className="design-clinic">
      <header className="site-header">
        <a className="brand" href="/angular-bug-clinic/#/">
          + Angular <strong>Bug Clinic</strong>
        </a>
        <nav aria-label="Main navigation">
          <a href="/angular-bug-clinic/#/">Case library</a>
          <a href="/angular-bug-clinic/react/">Case 06</a>
          <a href="/angular-bug-clinic/react/cases/07-node-refresh-race/">Case 07</a>
          <a href="/angular-bug-clinic/react/cases/09-form-errors/">Case 09</a>
          <a href="/angular-bug-clinic/react/cases/11-spa-analytics/">Case 11</a>
          <a href="/angular-bug-clinic/react/cases/12-core-web-vitals/">Case 12</a>
          <a href="/angular-bug-clinic/react/cases/13-design-to-code/" aria-current="page">
            Case 13
          </a>
          <a href="/angular-bug-clinic/react/cases/14-code-review-sample/">Case 14</a>
        </nav>
      </header>
      <main>
        <div className="design-intro">
          <a className="back-link" href="/angular-bug-clinic/#/">
            ← Back to the case library
          </a>
          <p className="eyebrow">CASE 13 / React · CSS · Accessibility</p>
          <h1>The design that broke on phones</h1>
          <p>
            One original design. Compare a rigid implementation with a fluid, keyboard-friendly
            build.
          </p>
          <div className="design-links">
            <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/13-design-to-code">
              Read the write-up ↗
            </a>
            <a href="/angular-bug-clinic/react/case-13/reference.html">
              Open the design reference ↗
            </a>
          </div>
          <div role="tablist" aria-label="Implementation">
            {['Broken', 'Fixed'].map((name) => (
              <button
                key={name}
                id={'design-' + name}
                role="tab"
                aria-selected={variant === name}
                aria-controls="design-panel"
                tabIndex={variant === name ? 0 : -1}
                onClick={() => setVariant(name)}
                onKeyDown={select}
              >
                {name}
              </button>
            ))}
          </div>
          <p className="design-hint">
            {variant === 'Broken'
              ? 'Try a narrow window, then use Tab and Enter on the FAQ. The rigid hero overlaps and div controls do not activate by keyboard.'
              : 'Resize the page and use the FAQ with Enter or Space. Grid, design tokens and native controls preserve the layout and interaction.'}
          </p>
        </div>
        <section id="design-panel" role="tabpanel" aria-labelledby={'design-' + variant}>
          <Studio key={variant} fixed={variant === 'Fixed'} />
        </section>
      </main>
    </div>
  );
}
