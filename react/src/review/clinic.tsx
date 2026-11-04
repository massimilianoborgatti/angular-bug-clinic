'use client';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import './report.css';
const route = '/angular-bug-clinic/react/cases/14-code-review-sample/';
const evidence = [
  {
    id: 'F01',
    title: 'Team ownership',
    broken: '200: Red team note returned to the Blue member.',
    fixed: '403: Red team note blocked; search returns only Blue records.',
  },
  {
    id: 'F02',
    title: 'Saved note content',
    broken: 'Saved markup executes the local DOM marker.',
    fixed: 'Markup stays text; no element or marker executes.',
  },
  {
    id: 'F03',
    title: 'Input boundary',
    broken: 'Empty fields and caller-supplied ownership are accepted.',
    fixed: '400: invalid fields rejected; ownership comes from the trusted fixture.',
  },
];
export function ReviewClinic({ summary }: { summary: ReactNode }) {
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
    document.getElementById('report-' + next)?.focus();
  }
  return (
    <div className="review-clinic">
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
          <a href="/angular-bug-clinic/react/cases/13-design-to-code/">Case 13</a>
          <a href={route} aria-current="page">
            Case 14
          </a>
        </nav>
      </header>
      <main className="review-page">
        <p className="report-notice">
          Fictional app, sample report. Not a security certification or penetration test
        </p>
        <a className="back-link" href="/angular-bug-clinic/#/">
          ← Back to the case library
        </a>
        <header>
          <p className="eyebrow">CASE 14 / Code Review · React · Next.js</p>
          <h1>Sample code review: Northwind Notes</h1>
          <p className="review-lead">
            A readable owner summary, nine findings and tested repairs for a fictional AI-built app.
          </p>
        </header>
        <div className="review-links">
          <a href={route + 'report/'}>Read the full report ↗</a>
          <a href="/angular-bug-clinic/react/case-14/code-review-sample.pdf">Download the PDF ↓</a>
          <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/14-code-review-sample">
            Read the case write-up ↗
          </a>
        </div>
        <div className="review-summary">
          <section aria-labelledby="owner-summary-title">
            <h2 id="owner-summary-title">Owner summary: first priorities</h2>
            {summary}
            <p>
              <a href={route + 'report/'}>Continue the owner summary →</a>
            </p>
          </section>
          <aside aria-label="Report scope">
            <span className="review-count">09</span>
            <h2>Concrete findings.</h2>
            <p>3 High · 4 Medium · 2 Low</p>
            <p>
              <strong>Bounded evidence</strong>
              <br />
              18 unit contracts · 18 browser checks
            </p>
            <p>
              The app runs only locally. The demo identity and in-memory data are fixtures; the
              public page contains the report, not the running sample.
            </p>
            <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/samples/ai-built-review">
              Inspect the paired source ↗
            </a>
          </aside>
        </div>
        <section className="review-evidence" aria-labelledby="evidence-title">
          <h2 id="evidence-title">Three boundary repairs</h2>
          <p>
            Recorded local test outcomes. These controls compare evidence; they do not run the
            sample app.
          </p>
          <div role="tablist" aria-label="Evidence implementation">
            {['Broken', 'Fixed'].map((name) => (
              <button
                key={name}
                id={'report-' + name}
                role="tab"
                aria-selected={name === variant}
                aria-controls="report-evidence"
                tabIndex={name === variant ? 0 : -1}
                onClick={() => setVariant(name)}
                onKeyDown={select}
              >
                {name}
              </button>
            ))}
          </div>
          <div
            id="report-evidence"
            role="tabpanel"
            aria-labelledby={'report-' + variant}
            className={variant === 'Fixed' ? 'evidence-fixed' : 'evidence-broken'}
            data-testid="review-evidence"
          >
            <div className="evidence-grid">
              {evidence.map((item) => (
                <article key={item.id}>
                  <span>{item.id} / HIGH</span>
                  <h3>{item.title}</h3>
                  <p>{variant === 'Fixed' ? item.fixed : item.broken}</p>
                  <a href={route + 'report/#' + item.id.toLowerCase()}>Read finding {item.id} ↗</a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
