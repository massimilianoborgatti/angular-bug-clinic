'use client';
import Image from 'next/image';
import { useState, type CSSProperties } from 'react';
import tokens from '../../cases/13-design-to-code/design-tokens.json';
import './studio.css';

const asset = '/angular-bug-clinic/react/case-13/';
const tokenStyle = Object.fromEntries(
  Object.entries(tokens).flatMap(([group, values]) =>
    typeof values === 'string'
      ? [['--studio-' + group, values]]
      : Object.entries(values).map(([key, value]) => ['--studio-' + group + '-' + key, value]),
  ),
) as CSSProperties;
const features = [
  [
    'A clear starting point',
    'We turn a small set of goals into a calm, useful page with a clear next step.',
  ],
  [
    'Room for every screen',
    'Flexible layouts keep the same story intact, from a pocket screen to a wide canvas.',
  ],
  [
    'Built for people',
    'Readable text, useful names and keyboard controls make the details work together.',
  ],
];
const questions = [
  ['What is included?', 'A one-page design, a responsive build and a focused accessibility pass.'],
  [
    'Does it work on phones?',
    'The layout adapts to small screens, with room for text and comfortable controls.',
  ],
  [
    'Can I explore without sending anything?',
    'Yes. This is a fictional demonstration. No enquiry or personal information is sent.',
  ],
];

function Question({
  fixed,
  question,
  answer,
}: {
  fixed: boolean;
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  const label = (
    <>
      <span>{question}</span>
      <span aria-hidden="true">+</span>
    </>
  );
  return fixed ? (
    <details>
      <summary>{label}</summary>
      <p>{answer}</p>
    </details>
  ) : (
    <div className="s-mouse-question">
      <div className="s-question-trigger" tabIndex={0} onClick={() => setOpen(!open)}>
        {label}
      </div>
      {open && <p>{answer}</p>}
    </div>
  );
}

export function Studio({ fixed }: { fixed: boolean }) {
  const [feedback, setFeedback] = useState('');
  const enquire = () => setFeedback('Demo enquiry selected. No message is sent.');
  function action(text: string) {
    const label = (
      <>
        {text} <span aria-hidden="true">↗</span>
      </>
    );
    return fixed ? (
      <button className="s-action" type="button" onClick={enquire}>
        {label}
      </button>
    ) : (
      <div className="s-action" tabIndex={0} onClick={enquire}>
        {label}
      </div>
    );
  }
  return (
    <div
      className={'studio ' + (fixed ? 'studio-fixed' : 'studio-broken')}
      style={fixed ? tokenStyle : undefined}
      id="studio-top"
    >
      <header className="s-shell s-header">
        <a className="s-brand" href="#studio-top">
          <span aria-hidden="true">✳</span>Example Studio
        </a>
        <nav aria-label="Studio navigation">
          <a href="#studio-work">Approach</a>
          <a href="#studio-pricing">Pricing</a>
          <a href="#studio-faq">FAQ</a>
        </nav>
      </header>
      <section className="s-shell s-hero" aria-label="Studio introduction">
        <div className="s-hero-copy">
          <p className="s-eyebrow">SMALL STUDIO. CLEAR INTENT.</p>
          <h2 className="s-hero-title" data-testid="studio-heading">
            <span>Good design.</span>
            <span>Made to work.</span>
          </h2>
          <p className="s-lead">
            Thoughtful pages for ideas worth sharing. Clear on a wide screen. Just as considered on
            a small one.
          </p>
          {action('Start a project')}
          <p className="s-footnote">A fictional studio. A practical eye for detail.</p>
          <p className="s-feedback" role="status">
            {feedback}
          </p>
        </div>
        <Image
          className="s-art"
          data-testid="studio-art"
          src={asset + 'studio-board.svg'}
          width={560}
          height={440}
          unoptimized
          alt="Abstract page layouts on a green drawing board"
        />
      </section>
      <section className="s-shell s-section" id="studio-work" aria-labelledby="studio-work-title">
        <div className="s-section-title">
          <p className="s-eyebrow">THE WAY WE WORK</p>
          <h2 id="studio-work-title">
            Care in the details.
            <br />
            Clarity in the result.
          </h2>
        </div>
        <div className="s-features">
          {features.map(([title, text], index) => (
            <article key={title}>
              <span className="s-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className="s-shell s-section"
        id="studio-pricing"
        aria-labelledby="studio-pricing-title"
      >
        <div className="s-pricing">
          <div>
            <p className="s-eyebrow">A SIMPLE SAMPLE PLAN</p>
            <h2 id="studio-pricing-title">
              One page.
              <br />A considered whole.
            </h2>
            <p>Design, responsive build and a careful final pass.</p>
          </div>
          <div className="s-price">
            <span>Fictional project price</span>
            <strong>$950</strong>
            <p>One clear scope. No checkout or payment.</p>
            <a className="s-action s-light" href="#studio-contact">
              Explore the sample plan <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>
      <section
        className="s-shell s-section s-faq"
        id="studio-faq"
        aria-labelledby="studio-faq-title"
      >
        <div>
          <p className="s-eyebrow">A FEW USEFUL ANSWERS</p>
          <h2 id="studio-faq-title">Before we begin.</h2>
        </div>
        <div className="s-questions">
          {questions.map(([question, answer]) => (
            <Question fixed={fixed} key={question} question={question} answer={answer} />
          ))}
        </div>
      </section>
      <section
        className="s-shell s-section"
        id="studio-contact"
        aria-labelledby="studio-contact-title"
      >
        <div className="s-contact">
          <p className="s-eyebrow">A SMALL IDEA IS A GOOD START</p>
          <h2 id="studio-contact-title">Let&apos;s make room for it.</h2>
          <p>Explore the sample. Nothing leaves this page.</p>
          {action('Start a sample enquiry')}
        </div>
      </section>
      <footer className="s-shell s-footer">
        <span>Example Studio · Fictional design practice</span>
        <a
          className="s-icon"
          data-testid="studio-top-link"
          href="#studio-top"
          aria-label={fixed ? 'Back to top' : undefined}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 12 12 5l7 7M12 5v14" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
