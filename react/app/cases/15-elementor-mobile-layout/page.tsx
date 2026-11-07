import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Elementor mobile layout fixes | Bug Clinic',
  description:
    'A fictional bicycle workshop landing page before and after responsive fixes in Elementor Free.',
};

const assets = '/angular-bug-clinic/react/case-15';

const comparison = [
  {
    name: 'Broken',
    image: 'broken-390.png',
    height: 1932,
    alt: 'Mobile landing page with a clipped heading, a desktop menu and three narrow cards on one row.',
    caption: 'The page scrolls sideways and the services cards squeeze into one row.',
  },
  {
    name: 'Fixed',
    image: 'fixed-390.png',
    height: 2343,
    alt: 'Mobile landing page with a wrapped heading, a compact menu and three stacked services cards.',
    caption: 'The content fits the screen and the mobile menu and testimonials are visible.',
  },
];

export default function Page() {
  return (
    <main className={styles.case}>
      <a href="/angular-bug-clinic/react/">← Back to the Bug Clinic</a>
      <header className={styles.header}>
        <p className={styles.eyebrow}>CASE 15 / WORDPRESS · ELEMENTOR FREE</p>
        <h1>Elementor mobile layout fixes</h1>
        <p>
          Northline Bicycle Workshop is a fictional landing page. Codex built and tested the
          WordPress demo and captured the evidence below.
        </p>
        <p>Massimiliano practiced the hero width and card stacking fixes in Elementor Free.</p>
        <p>Personal fictional demo. The workshop and testimonials are invented.</p>
      </header>

      <section aria-labelledby="comparison">
        <h2 id="comparison">Before and after at 390 px</h2>
        <div className={styles.comparison}>
          {comparison.map(({ name, image, height, alt, caption }) => (
            <figure className={styles.figure} key={name}>
              <figcaption>
                <strong>{name}</strong>
                <span>{caption}</span>
              </figcaption>
              <a
                href={assets + '/' + image}
                aria-label={'Open the full ' + name + ' mobile screenshot'}
              >
                {/* These screenshots are original PNGs from the local demo. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assets + '/' + image} width={390} height={height} alt={alt} />
              </a>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.notes} aria-labelledby="fixes">
        <h2 id="fixes">What changed</h2>
        <ul>
          <li>
            Set the hero copy to the available mobile width. The page width dropped from 540 to 390
            px.
          </li>
          <li>
            Stacked the three services cards, reduced horizontal padding and restored testimonials
            on mobile.
          </li>
          <li>
            Used a native disclosure for the mobile menu and checked keyboard focus and anchor
            navigation.
          </li>
          <li>Added scoped CSS so the HTML-widget form fields fit inside their container.</li>
        </ul>
        <p>
          The fixed page was tested at 390, 820 and 1280 px. Both variants produced identical
          desktop screenshots at 1280 px.
        </p>
        <ul className={styles.evidence}>
          <li>
            <a href={assets + '/fixed-1280.png'}>Desktop at 1280 px</a>
          </li>
          <li>
            <a href={assets + '/fixed-390-menu.png'}>Mobile menu open</a>
          </li>
          <li>
            <a href={assets + '/fixed-390-form.png'}>Mobile form fields</a>
          </li>
        </ul>
      </section>
    </main>
  );
}
