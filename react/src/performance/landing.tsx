'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, useMemo } from 'react';
import { projectPrices, type Period } from './pricing';
import { VitalsPanel } from './vitals';
import './landing.css';
const assets = '/angular-bug-clinic/react/case-12/';
const route = '/angular-bug-clinic/react/cases/12-core-web-vitals/';
function artworkLoader({ width }: { width: number }) {
  return assets + (width <= 640 ? 'notebook-640.webp' : 'notebook.webp');
}
function LazyArtwork() {
  const target = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      const image = new window.Image();
      image.onload = () => {
        if (active) setLoaded(true);
      };
      image.src = assets + 'notebook-large.png';
      observer.disconnect();
    });
    if (target.current) observer.observe(target.current);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);
  return (
    <div
      ref={target}
      role="img"
      aria-label="Northwind Notes workspace preview"
      data-testid="hero-art"
      data-loaded={loaded}
      className={'notes-art lazy-art ' + (loaded ? 'art-loaded' : '')}
      style={loaded ? { backgroundImage: `url(${assets}notebook-large.png)` } : undefined}
    />
  );
}
export function PerformanceLanding({ fixed }: { fixed: boolean }) {
  const [period, setPeriod] = useState<Period>('monthly');
  const [banner, setBanner] = useState(false);
  const [response, setResponse] = useState<number | null>(null);
  const startRef = useRef<number | null>(null);
  const cached = useMemo(
    () =>
      fixed
        ? { monthly: projectPrices('monthly', true), annual: projectPrices('annual', true) }
        : null,
    [fixed],
  );
  const [slow, setSlow] = useState(() => (fixed ? null : projectPrices('monthly', false)));
  const price = cached?.[period] || slow;
  useEffect(() => {
    const timer = setTimeout(() => setBanner(true), 1200);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (startRef.current === null) return;
    const started = startRef.current;
    const frame = requestAnimationFrame(() => setResponse(performance.now() - started));
    return () => cancelAnimationFrame(frame);
  }, [period]);
  function toggle() {
    startRef.current = performance.now();
    const next = period === 'monthly' ? 'annual' : 'monthly';
    if (!fixed) setSlow(projectPrices(next, false));
    setPeriod(next);
  }
  return (
    <div className={'performance-case ' + (fixed ? 'performance-fixed' : 'performance-broken')}>
      {fixed && (
        <link
          rel="preload"
          href={assets + 'dm-sans-latin.woff2'}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      )}
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
          <a href={route} aria-current="page">
            Case 12
          </a>
        </nav>
      </header>
      <main className="performance-page">
        <header className="performance-heading">
          <p className="eyebrow">CASE 12 / REACT · WEB PERFORMANCE</p>
          <h1>The landing page that felt slow</h1>
          <p>Same notebook. Less waiting, fewer shifts, a pricing toggle that responds.</p>
        </header>
        <div className="performance-switch" role="tablist" aria-label="Implementation">
          {['broken', 'fixed'].map((mode) => (
            <a
              key={mode}
              role="tab"
              aria-selected={(mode === 'fixed') === fixed}
              className={(mode === 'fixed') === fixed ? 'selected' : ''}
              href={route + mode + '/'}
            >
              {mode === 'fixed' ? 'Fixed' : 'Broken'}
            </a>
          ))}
        </div>
        <p className="performance-hint">
          Each tab loads a fresh document for comparable metrics. Watch the artwork and banner, then
          toggle billing.
        </p>
        {banner && (
          <div className="notes-banner" data-testid="notes-banner">
            <span>Fictional cookie notice. Nothing is stored or tracked.</span>
            <button onClick={() => setBanner(false)}>Dismiss notice</button>
          </div>
        )}
        <section className="notes-landing" aria-label="Northwind Notes">
          <div className="performance-hero">
            <div className="notes-copy">
              <p className="eyebrow">NORTHWIND NOTES</p>
              <h2>
                Less clutter.
                <br />
                More room to think.
              </h2>
              <p>A calm notebook for ideas, everyday plans and your next small project.</p>
              <a className="button" href="#notes-pricing">
                Find your rhythm ↓
              </a>
            </div>
            {fixed ? (
              <Image
                className="notes-art"
                data-testid="hero-art"
                src={assets + 'notebook.webp'}
                alt="Northwind Notes workspace preview"
                width={1200}
                height={750}
                sizes="(max-width: 700px) 100vw, 55vw"
                priority
                fetchPriority="high"
                loader={artworkLoader}
              />
            ) : (
              <LazyArtwork />
            )}
          </div>
          <section className="notes-pricing" id="notes-pricing" aria-label="Simple pricing">
            <div>
              <p className="eyebrow">ONE NOTEBOOK. ALL YOUR IDEAS.</p>
              <h2>Simple pricing, a little more space.</h2>
              <p>4,000 fictional workspace estimates. Same prices in both versions.</p>
            </div>
            <div className="price-box">
              <button
                data-testid="billing-toggle"
                aria-pressed={period === 'annual'}
                onClick={toggle}
              >
                Annual billing
              </button>
              <p>
                <strong data-testid="plan-price">{price?.price}</strong> / month
              </p>
              <span data-testid="billing-period">
                {period === 'annual' ? 'Billed annually · save 25%' : 'Billed monthly'}
              </span>
              <p className="response-note" data-testid="toggle-response" data-ms={response ?? ''}>
                {response === null
                  ? 'Toggle to measure the next frame.'
                  : `Next-frame response: ${Math.round(response)} ms`}
              </p>
            </div>
          </section>
          <section className="notes-testimonials" aria-label="Notebook stories">
            {[
              'A place for the next idea.',
              'The daily list, made calmer.',
              'From scattered thoughts to a plan.',
            ].map((text, index) => (
              <article key={text}>
                {fixed ? (
                  <Image src={assets + 'notebook.webp'} width={64} height={40} alt="" unoptimized />
                ) : (
                  // Deliberately omit intrinsic dimensions in Broken.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assets + 'notebook-thumb.png'} alt="" loading="lazy" />
                )}
                <p>{text}</p>
                <span>Demo notebook {index + 1}</span>
              </article>
            ))}
          </section>
        </section>
        <VitalsPanel />
        <section className="performance-explanation">
          <div>
            <p className="note-index">THE DIAGNOSIS</p>
            <h2>Late pixels. Moving content. Repeated work.</h2>
            <p>
              Broken discovers an oversized lossless background after hydration, blocks text on a
              font, reserves no artwork space, inserts its notice into the document flow and
              rebuilds thousands of formatters on every toggle.
            </p>
          </div>
          <div>
            <p className="note-index">THE REPAIR</p>
            <h2>Discover, reserve, reuse.</h2>
            <p>
              Fixed preloads a compact WebP through next/image, swaps a preloaded font, reserves
              image space, overlays its notice and memoizes pricing projections with a shared
              formatter.
            </p>
            <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/tree/main/react/cases/12-core-web-vitals">
              Read the measurements and case write-up ↗
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>Built to make debugging visible.</span>
        <span>Lab budgets and real browser measurements</span>
      </footer>
    </div>
  );
}
