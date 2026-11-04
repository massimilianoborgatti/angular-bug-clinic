'use client';
import Link from 'next/link';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { type Consent, DemoAnalytics } from './tracker';
import { usePageViews } from './use-page-views';
import './clinic.css';
const base = '/cases/11-spa-analytics/';
const Context = createContext<{ analytics: DemoAnalytics; mode: string } | null>(null);
export function AnalyticsClinic({ children }: { children: ReactNode }) {
  const mode = useSearchParams().get('mode') === 'fixed' ? 'fixed' : 'broken';
  const focusTabRef = useRef(false);
  return (
    <Experiment key={mode} mode={mode} focusTabRef={focusTabRef}>
      {children}
    </Experiment>
  );
}
function Experiment({
  mode,
  children,
  focusTabRef,
}: {
  mode: string;
  children: ReactNode;
  focusTabRef: RefObject<boolean>;
}) {
  const [analytics] = useState(() => new DemoAnalytics(mode === 'fixed'));
  const [consent, setConsent] = useState<Consent>('pending');
  const commands = useSyncExternalStore(
    analytics.subscribe,
    analytics.snapshot,
    analytics.snapshot,
  );
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    analytics.initialize();
  }, [analytics]);
  useEffect(() => {
    if (focusTabRef.current) {
      document.getElementById('analytics-' + mode)?.focus();
      focusTabRef.current = false;
    }
  }, [mode, focusTabRef]);
  usePageViews(analytics, consent);
  const count = commands.filter(
    ([command, name]) => command === 'event' && name === 'page_view',
  ).length;
  function answer(value: 'granted' | 'denied') {
    analytics.answer(value);
    setConsent(value);
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 'broken'
        : event.key === 'End'
          ? 'fixed'
          : mode === 'fixed'
            ? 'broken'
            : 'fixed';
    focusTabRef.current = true;
    router.push(base + '?mode=' + next);
  }
  return (
    <Context.Provider value={{ analytics, mode }}>
      <header className="site-header">
        <a className="brand" href="/angular-bug-clinic/#/">
          + Angular <strong>Bug Clinic</strong>
        </a>
        <nav aria-label="Main navigation">
          <a href="/angular-bug-clinic/#/">Case library</a>
          <Link prefetch={false} href="/">
            Case 06
          </Link>
          <Link prefetch={false} href="/cases/07-node-refresh-race/">
            Case 07
          </Link>
          <Link prefetch={false} href="/cases/09-form-errors/">
            Case 09
          </Link>
          <Link prefetch={false} href={base} aria-current="page">
            Case 11
          </Link>
          <Link prefetch={false} href="/cases/12-core-web-vitals/">
            Case 12
          </Link>
          <Link prefetch={false} href="/cases/13-design-to-code/">
            Case 13
          </Link>
          <Link prefetch={false} href="/cases/14-code-review-sample/">
            Case 14
          </Link>
        </nav>
      </header>
      <main className="case-page analytics-clinic">
        <a className="back-link" href="/angular-bug-clinic/#/">
          ← Back to the case library
        </a>
        <header className="case-heading">
          <p className="eyebrow">
            CASE 11 <span>/ React · Analytics</span>
          </p>
          <h1>Page views that lied</h1>
          <p>Two views on load. None on navigation. A consent choice that arrives too late.</p>
        </header>
        <div className="case-workspace">
          <section className="experiment" aria-label="Interactive demonstration">
            <div className="experiment-top">
              <div role="tablist" aria-label="Implementation">
                {(['broken', 'fixed'] as const).map((item) => (
                  <button
                    key={item}
                    id={'analytics-' + item}
                    type="button"
                    role="tab"
                    aria-controls="analytics-panel"
                    aria-selected={mode === item}
                    tabIndex={mode === item ? 0 : -1}
                    className={mode === item ? 'selected' : ''}
                    onClick={() => router.push(base + '?mode=' + item)}
                    onKeyDown={tabKey}
                  >
                    <span className={'tab-dot ' + item + '-dot'} />
                    {item === 'fixed' ? 'Fixed' : 'Broken'}
                  </button>
                ))}
              </div>
              <span className="experiment-label">LOCAL TRACKING DEMO</span>
            </div>
            <div className="look-hint">
              <span aria-hidden="true">↳</span>
              <p>
                <strong>What to look at</strong>Accept, then follow Home → Plants → Monstera →
                another color. Compare four page views with two stale ones. Switching tabs starts a
                fresh session.
              </p>
            </div>
            <div
              className="demo-panel"
              role="tabpanel"
              id="analytics-panel"
              aria-labelledby={'analytics-' + mode}
            >
              <div className="variant-caption">
                <span className={'status ' + (mode === 'fixed' ? 'success' : 'danger')}>
                  {mode === 'fixed' ? 'FIX APPLIED' : 'BUG REPRODUCED'}
                </span>
                <span>No Google scripts. No tracking requests.</span>
              </div>
              <section className="analytics-shop" aria-label="Demo Plant Shop">
                <div className="shop-heading">
                  <div>
                    <p className="eyebrow">DEMO PLANT SHOP</p>
                    <h2>A little green, thoughtfully chosen.</h2>
                  </div>
                  <div>
                    <strong className="metric" data-testid="page-view-count">
                      {count}
                    </strong>
                    <span className="metric-label">page views</span>
                  </div>
                </div>
                <nav aria-label="Shop navigation">
                  <Link prefetch={false} href={base + '?mode=' + mode}>
                    Home
                  </Link>
                  <Link prefetch={false} href={base + 'plants/?mode=' + mode}>
                    Plants
                  </Link>
                </nav>
                {children}
                <div className="consent-choice">
                  <h3>Analytics consent</h3>
                  <p>
                    Local simulation only. Choose whether this demo may record events in memory.
                  </p>
                  <p role="status">Consent: {consent}</p>
                  <div className="analytics-actions">
                    <button onClick={() => answer('granted')}>Accept</button>
                    <button onClick={() => answer('denied')}>Reject</button>
                  </div>
                </div>
              </section>
              <section className="analytics-inspector" aria-label="dataLayer inspector">
                <h2>dataLayer inspector</h2>
                <p className="mock-note">
                  G-DEMO000000 · GTM-DEMO000 · in-memory stub
                  <br />
                  Route:{' '}
                  <span data-testid="shop-path">
                    {pathname.replace('/angular-bug-clinic/react', '')}
                  </span>
                </p>
                <ol>
                  {commands.map((entry, index) => (
                    <li key={index}>
                      <span className="command-number">{String(index + 1).padStart(2, '0')}</span>
                      <pre>{JSON.stringify(entry)}</pre>
                    </li>
                  ))}
                </ol>
                {commands.length === 0 && <p>Waiting for initialization…</p>}
              </section>
            </div>
          </section>
          <aside className="case-notes">
            <div>
              <span className="note-index">01 / THE DIAGNOSIS</span>
              <h2>One document, many pages</h2>
              <p>
                An automatic config view and a mount-only effect count twice, then miss client
                navigation. Events ignore consent.
              </p>
            </div>
            <div>
              <span className="note-index">02 / THE REPAIR</span>
              <h2>Let the route own the event</h2>
              <p>
                Default denied first. Disable the automatic view; observe pathname and query only
                after consent is granted.
              </p>
            </div>
            <div className="takeaway">
              <span className="note-index">TAKE IT WITH YOU</span>
              <p>One page-view owner. Consent before measurement.</p>
            </div>
            <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/11-spa-analytics">
              Read the case write-up ↗
            </a>
          </aside>
        </div>
      </main>
      <footer className="site-footer">
        <span>Built to make debugging visible.</span>
        <span>React · Next.js · local analytics</span>
      </footer>
    </Context.Provider>
  );
}
export function ShopPage({ screen }: { screen: 'home' | 'plants' | 'detail' }) {
  const context = useContext(Context);
  const color = useSearchParams().get('color') || 'green';
  if (!context) return null;
  const { analytics, mode } = context;
  const detail = base + 'plants/detail/?mode=' + mode;
  return (
    <div className="shop-content">
      <h3>{screen === 'home' ? 'Home' : screen === 'plants' ? 'Plants' : 'Monstera · ' + color}</h3>
      <p>
        {screen === 'home'
          ? 'Meet your next windowsill companion.'
          : screen === 'plants'
            ? 'Explore our fictional collection of leafy favorites.'
            : 'A leafy favorite, $24.00. Pick a pot color or save it for later.'}
      </p>
      {screen === 'home' ? (
        <Link prefetch={false} className="button" href={base + 'plants/?mode=' + mode}>
          Browse plants →
        </Link>
      ) : screen === 'plants' ? (
        <Link prefetch={false} className="button" href={detail + '&color=green'}>
          Monstera →
        </Link>
      ) : (
        <div className="analytics-actions">
          <Link
            prefetch={false}
            className="button"
            href={detail + '&color=' + (color === 'green' ? 'clay' : 'green')}
          >
            Choose {color === 'green' ? 'clay' : 'green'} pot
          </Link>
          <button
            onClick={() =>
              analytics.event('add_to_wishlist', {
                currency: 'USD',
                value: 24,
                items: [
                  {
                    item_id: 'demo-monstera',
                    item_name: 'Monstera',
                    item_variant: color,
                    price: 24,
                    quantity: 1,
                  },
                ],
              })
            }
          >
            Add to wishlist
          </button>
        </div>
      )}
    </div>
  );
}
